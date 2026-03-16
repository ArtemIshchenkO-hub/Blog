import Home from '../pages/Home'
import CreatePost from '../pages/CreatePost'
import Profile from '../pages/Profile'

export const publicRoutes = [{ path: '/home', component: Home }]

export const privateRoutes = [
  { path: '/create-post', component: CreatePost },
  { path: '/profile/:id', component: Profile },
]
