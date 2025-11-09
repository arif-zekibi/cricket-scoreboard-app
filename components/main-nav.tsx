"use client"

interface MainNavProps {
  currentView: "history" | "setup" | "match"
  onNavigate: (view: "history" | "setup" | "match") => void
  onBackToSetup: () => void
}

export function MainNav({ currentView, onNavigate, onBackToSetup }: MainNavProps) {
  return (
    <header className="bg-blue-900 text-white border-b border-blue-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex-1">
          <button
            onClick={() => onNavigate("history")}
            className="text-2xl font-bold hover:opacity-80 transition-opacity"
          >
            Cricket Scorer
          </button>
          <p className="text-sm opacity-90">Live Match Management System</p>
        </div>

        <div className="flex gap-3">
          {currentView !== "history" && (
            <button
              onClick={() => onNavigate("history")}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Match History
            </button>
          )}

          {currentView === "match" && (
            <button
              onClick={onBackToSetup}
              className="px-4 py-2 bg-white text-blue-900 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              New Match
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
