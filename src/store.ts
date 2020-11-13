import { Commit, createStore } from 'vuex'
import axios from 'axios'

export interface GlobalDataProps{
  user: UserProps;
  columns: ColumnProps[];
  posts: PostProps[];
  loading: boolean;
  token: string;
  error: GlobalErrorProps;
}

export interface ResponseType<P = {}> {
  code: number;
  msg: string;
  data: P;
}
export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
  avatar?: ImageProps;
  description?: string;
}
export interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
  fitUrl?: string;
}
export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}
export interface PostProps {
  _id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps | string;
  createdAt?: string;
  column: string;
  author?: string | UserProps;
  isHTML?: boolean;
}
interface ListProps<P> {
  [id: string]: P;
}
export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}
// export interface GlobalDataProps {
//   token: string;
//   error: GlobalErrorProps;
//   loading: boolean;
//   columns: { data: ListProps<ColumnProps>; isLoaded: boolean; total: number };
//   posts: { data: ListProps<PostProps>; loadedColumns: string[] };
//   user: UserProps;
// }

const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
  const { data } = await axios.get(url)
  commit(mutationName, data)
}

const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => {
  const { data } = await axios.post(url, payload)
  commit(mutationName, data)
  return data
}

const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: [],
    posts: [],
    user: {
      isLogin: false
    }
  },
  mutations: {
    setLoading (state, status) {
      state.loading = status
    },
    login (state, payload) {
      const { token } = payload.data
      state.token = token
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      localStorage.setItem('token', token)
    },
    logout (state) {
      state.token = ''
      state.user = { isLogin: false }
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    },
    createPost (state, newPost) {
      state.posts.push(newPost)
    },
    fetchColumns (state, payload) {
      state.columns = payload.data.list
    },
    fetchColumn (state, payload) {
      state.columns = [payload.data]
    },
    fetchPosts (state, payload) {
      state.posts = payload.data.list
    },
    fetchCurrentUser (state, payload) {
      state.user = {
        isLogin: true,
        ...payload.data
      }
    },
    setError (state, e: GlobalErrorProps) {
      state.error = e
    }
  },
  actions: {
    fetchColumns ({ commit }) {
      getAndCommit('/columns', 'fetchColumns', commit)
    },
    fetchColumn ({ commit }, cid) {
      getAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts ({ commit }, cid) {
      getAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit)
    },
    login ({ commit }, payload) {
      return postAndCommit('/user/login', 'login', commit, payload)
    },
    fetchCurrentUser ({ commit }) {
      getAndCommit('/user/current', 'fetchCurrentUser', commit)
    },
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    }
  },
  getters: {
    getColumnById: (state) => {
      return (id: string) => {
        return state.columns.find(c => c._id === id)
      }
    },
    getPostsById: (state) => {
      return (id: string) => {
        return state.posts.filter(post => post.column === id)
      }
    }
  }
})

export default store
