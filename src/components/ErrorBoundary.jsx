import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    try {
      sessionStorage.clear();
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          dir="rtl"
          className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 text-center font-sans"
        >
          <div className="max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="text-4xl mb-4">⚠️</div>
            <h1 className="text-xl font-bold mb-2 text-white">אירעה שגיאה בטעינת הדף</h1>
            <p className="text-sm text-slate-300 mb-6">
              המערכת זיהתה תקלה רגעית. לחץ על הכפתור למטה כדי לרענן את האפליקציה.
            </p>
            <button
              onClick={this.handleReload}
              className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-bold text-sm shadow-lg transition-all cursor-pointer"
            >
              רענן דף מחדש
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
