import "../css/app.css"
import React from "react"
import ReactDOM from "react-dom/client"
import Question from "./pages/question"
import QuestionEdit from "./pages/question-edit" // Added import for edit page
import QuestionView from "./pages/question-view" // Added import for view page
import Landing from "./pages/landing"
import Dashboard from "./pages/dashboard/page" // Added import for profile page

const el = document.getElementById("app")
const page = el?.getAttribute("data-page")

if (el) {
  ReactDOM.createRoot(el).render(
    <React.StrictMode>
      {page === "landing" && <Landing />}
      {page === "question" && <Question />}
      {page === "question-edit" && <QuestionEdit />} {/* Added routing for edit page */}
      {page === "question-view" && <QuestionView />} {/* Added routing for view page */}
      {page === "dashboard" && <Dashboard />} {/* Added routing for login page */}
    </React.StrictMode>,
  )
}
 