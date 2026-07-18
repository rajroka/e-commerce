'use client';

import React from 'react';

interface Props  { children: React.ReactNode; fallback?: React.ReactNode; }
interface State  { hasError: boolean; error: Error | null; }

class ProductErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('[ProductErrorBoundary] Caught error:', error, info);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[400px] bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center max-w-md bg-white border border-gray-100 shadow-sm p-10 rounded-2xl">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Something went wrong</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Some products could not be loaded. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-8 py-3 bg-gray-800 hover:bg-black text-white text-sm font-semibold transition-all rounded-xl"
            >
              Refresh page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ProductErrorBoundary;


