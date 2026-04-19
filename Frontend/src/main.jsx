import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux';
import { store } from './store/store';
import Loading from './components/Loading.jsx'

// Lazy load page components for better performance
// These components will only be loaded when their routes are accessed
const HomePage = lazy(() => import('./pages/Homepage.jsx'));
const Videos = lazy(() => import('./pages/Videos.jsx'));
const ChannelProfile = lazy(() => import('./components/Channel.jsx'));
const ChannelList = lazy(() => import('./components/ChannelList.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const ErrorPage = lazy(() => import('./components/Error.jsx'));
const RouteErrorBoundary = lazy(() => import('./components/RouteErrorBoundary.jsx'));

// Import studio components for content management
import CreateVideo from './components/videoForms/UploadVideo.jsx'
import UpdateVideo from './components/videoForms/UpdateVideo.jsx'
import CreateChannel from './components/channelForms/CreateChannel.jsx'
import UpdateChannel from './components/channelForms/UpdateChannel.jsx'
import UpdateProfile from './components/userActions/UserUpdate.jsx'
import UserLibrary from './components/userActions/ManageUser.jsx'

// Define application routing structure
// Main app routes with nested layouts for better organization
const appRouter = createBrowserRouter([
    {
        // Main application layout with header and sidebar
        path: "/",
        element: <App />,
        errorElement: (
            <Provider store={store}>
                <Suspense fallback={<Loading variant="spinner" size="full" text="Loading..." />}>
                    <RouteErrorBoundary />
                </Suspense>
            </Provider>
        ),
        children: [
            {
                // Home page - main video feed
                path: "/",
                element: <HomePage />
            },
            {
                // Video watch page with player and comments
                path: "/watch/:id",
                element: <Videos />,
            },
            {
                // Channel-related routes with nested structure
                path: "/channel",
                children:[
                    {
                        // List all channels
                        index: true,
                        element: <ChannelList />
                        
                    },
                    {
                        // Individual channel profile page
                        path:":channelId",
                        element:<ChannelProfile/>
                    }
                ]
            },
            {
                // Studio routes for content creators
                path: "/studio",
                children: [
                    {
                        // Upload new video
                        path: "CreateVideo",
                        element: <CreateVideo/>
                    },
                    {
                        // Update existing video
                        path: "updateVideo",
                        element: <UpdateVideo />
                    },{
                        // Update channel information
                        path:"updateChannel",
                        element:<UpdateChannel/>
                    }
                    ,{
                        // Create new channel
                        path:"createChannel",
                        element:<CreateChannel/>
                    },{
                        // Update user profile
                        path:"updateProfile",
                        element:<UpdateProfile/>
                    },{
                        // Manage user account and library
                        path:"manageAccount",
                        element:<UserLibrary/>
                    }
                    
                ]
            },
        ]

    },

    {
        // Authentication routes - separate from main app layout
        path: "/login",
        element: (
            <Provider store={store}>
                <Suspense fallback={<Loading variant="spinner" size="full" text="Loading Login..." />}>
                    <Login />
                </Suspense>
            </Provider>
        ),
        errorElement: (
            <Provider store={store}>
                <Suspense fallback={<Loading variant="spinner" size="full" text="Loading..." />}>
                    <RouteErrorBoundary />
                </Suspense>
            </Provider>
        )
    }, {
        path: "/register",
        element: (
            <Provider store={store}>
                <Suspense fallback={<Loading variant="spinner" size="full" text="Loading Register..." />}>
                    <Register />
                </Suspense>
            </Provider>
        ),
        errorElement: (
            <Provider store={store}>
                <Suspense fallback={<Loading variant="spinner" size="full" text="Loading..." />}>
                    <RouteErrorBoundary />
                </Suspense>
            </Provider>
        )
    }, {
        // Dedicated error route for manual error navigation
        path: "/error",
        element: (
            <Provider store={store}>
                <Suspense fallback={<Loading variant="spinner" size="full" text="Loading..." />}>
                    <ErrorPage />
                </Suspense>
            </Provider>
        )
    }, {
        // Catch-all route for 404 errors
        path: "*",
        element: (
            <Provider store={store}>
                <Suspense fallback={<Loading variant="spinner" size="full" text="Loading..." />}>
                    <ErrorPage status="404" title="Page Not Found" message="The page you are looking for does not exist or has been moved." />
                </Suspense>
            </Provider>
        )
    }
])

// Render the application with Redux store and router
// StrictMode enables additional development checks and warnings
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider router={appRouter} />
        </Provider>
    </StrictMode>
)