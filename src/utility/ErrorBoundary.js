import { Component } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Link from '@material-ui/core/Link'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
  }

  clearError(e) {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <>
          <h1>ErrorBoundary: Something went wrong.</h1>
          <Router>
            <Link to="/" onClick={this.clearError.bind(this)}>
              Back Home
            </Link>
          </Router>
        </>
      )
    }

    return this.props.children
  }
}
