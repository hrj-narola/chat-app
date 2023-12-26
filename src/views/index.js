import React from 'react';
/**
 * Note: Don't import/export all Views directly, use lazy loading!
 */
import { withSuspense } from '../components';
import NotFoundView from './NotFoundView';

/**
 * Views/Pages with Lazy Loading
 */
const ChatRoomView = withSuspense(React.lazy(() => import('./ChatRoom')));
const WelcomeView = withSuspense(React.lazy(() => import('./Welcome')));
const AboutView = withSuspense(React.lazy(() => import('./About')));
export { NotFoundView, AboutView, WelcomeView, ChatRoomView };
