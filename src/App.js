import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Main from "./pages/Main";
import Calendar from "./pages/Calendar";
import CalendarEdit from "./pages/CalendarEdit";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/ChatPage";
import Messages from "./pages/MessagesPage";
import Profile from "./pages/ProfilePage";
import EditServiceCard from "./pages/EditServiceCardPage";
import AddServiceCard from "./pages/AddServiceCardPage";
import CategoryPage from "./pages/CategoryPage";
import OrdersPage from "./pages/OrdersPage";
import ReviewsPage from "./pages/ReviewsPage";
import Test from "./pages/Test";
import React, {useContext} from 'react';
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ThemeProvider } from './components/ThemeProvider';
import {ThemeContext} from "./components/ThemeContext";


function App() {
  return (
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
  );
}

function AppContent() {
  const { theme } = useContext(ThemeContext);

  return (
      <div className={`app ${theme === 'dark' ? 'dark' : ''}`}>
        <Header />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Main/>}/>
            <Route path="/calendar/:id" element={<Calendar full={false}/>}/>
            <Route path="/calendar/full" element={<Calendar full={true}/>}/>
            <Route path="/calendar/edit/:id" element={<CalendarEdit full={false}/>}/>
            <Route path="/calendar/full/edit" element={<CalendarEdit full={true}/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/chats" element={<Chat/>}/>
            <Route path="/profile/:id" element={<Profile/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/messages/:id" element={<Messages />} />
            <Route path="/service-card/edit/:id" element={<EditServiceCard />} />
            <Route path="/service-card/add/:id" element={<AddServiceCard />} />
            <Route path="/reviews/:id" element={<ReviewsPage />} />
            <Route path="/collection/category/:id" element={<CategoryPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/test" element={<Test />} />
          </Routes>
        </main>
        <Footer />
      </div>
  );
}

export default App;

