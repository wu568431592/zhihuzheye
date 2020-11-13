import { Commit, createStore } from 'vuex'
import axios from 'axios'

export interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
  columnId?: number;
}

export interface GlobalDataProps{
  user: UserProps;
  columns: ColumnProps[];
  posts: PostProps[];
  loading: boolean;
}

export interface ResponseType<P = {}> {
  code: number;
  msg: string;
  data: P;
}
// export interface UserProps {
//   isLogin: boolean;
//   nickName?: string;
//   _id?: string;
//   column?: string;
//   email?: string;
//   avatar?: ImageProps;
//   description?: string;
// }
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

const store = createStore<GlobalDataProps>({
  state: {
    loading: false,
    columns: [],
    posts: [],
    user: {
      isLogin: false
      // isLogin: true,
      // name: '哈哈哈',
      // columnId: 1
    }
  },
  mutations: {
    setLoading (state, status) {
      state.loading = status
    },
    login (state) {
      state.user = {
        ...state.user,
        isLogin: true,
        name: '哈哈哈'
      }
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
    }
  },
  actions: {
    fetchColumns ({ commit }) {
      getAndCommit('/columns', 'fetchColumns', commit)
    },
    async fetchColumn ({ commit }, cid) {
      getAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
    },
    async fetchPosts ({ commit }, cid) {
      getAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit)
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
