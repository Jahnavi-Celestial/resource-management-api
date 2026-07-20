import React from "react";
import "./BookingDetailShimmer.css";

const BookingDetailShimmer = () => {
  return (
    <div className="bd-shimmer-bg">
      <div className="bd-shimmer-container">
        <header className="bd-shimmer-header">
          <div className="bd-shimmer-title-area">
            <div className="bd-shimmer-block bd-shimmer-back"></div>
            <div className="bd-shimmer-block bd-shimmer-title"></div>
          </div>
          <div className="bd-shimmer-block bd-shimmer-actions"></div>
        </header>

        <div className="bd-shimmer-grid">
          <main className="bd-shimmer-main-col">
            <div className="bd-shimmer-card">
              <div className="bd-shimmer-card-top">
                <div className="bd-shimmer-block bd-shimmer-badge"></div>
                <div className="bd-shimmer-block bd-shimmer-meta"></div>
              </div>
              <div className="bd-shimmer-block bd-shimmer-purpose"></div>
              
              <div className="bd-shimmer-split">
                <div className="bd-shimmer-info-item">
                  <div className="bd-shimmer-block bd-shimmer-icon"></div>
                  <div className="bd-shimmer-info-text">
                    <div className="bd-shimmer-block bd-shimmer-label"></div>
                    <div className="bd-shimmer-block bd-shimmer-value-1"></div>
                    <div className="bd-shimmer-block bd-shimmer-value-2"></div>
                  </div>
                </div>
                <div className="bd-shimmer-info-item">
                  <div className="bd-shimmer-block bd-shimmer-icon"></div>
                  <div className="bd-shimmer-info-text">
                    <div className="bd-shimmer-block bd-shimmer-label"></div>
                    <div className="bd-shimmer-block bd-shimmer-value-1"></div>
                    <div className="bd-shimmer-block bd-shimmer-value-2"></div>
                  </div>
                </div>
              </div>

              <div className="bd-shimmer-equipment">
                <div className="bd-shimmer-block bd-shimmer-label"></div>
                <div className="bd-shimmer-chips">
                  <div className="bd-shimmer-block bd-shimmer-chip"></div>
                  <div className="bd-shimmer-block bd-shimmer-chip"></div>
                  <div className="bd-shimmer-block bd-shimmer-chip"></div>
                </div>
              </div>
            </div>
          </main>

          <aside className="bd-shimmer-sidebar-col">
            <div className="bd-shimmer-card">
              <div className="bd-shimmer-block bd-shimmer-label"></div>
              <div className="bd-shimmer-profile">
                <div className="bd-shimmer-block bd-shimmer-avatar"></div>
                <div className="bd-shimmer-profile-text">
                  <div className="bd-shimmer-block bd-shimmer-value-1"></div>
                  <div className="bd-shimmer-block bd-shimmer-value-2"></div>
                </div>
              </div>
            </div>

            <div className="bd-shimmer-card">
              <div className="bd-shimmer-block bd-shimmer-label"></div>
              <div className="bd-shimmer-metric">
                <div className="bd-shimmer-block bd-shimmer-num"></div>
                <div className="bd-shimmer-block bd-shimmer-value-1"></div>
              </div>
            </div>

            <div className="bd-shimmer-logs">
              <div className="bd-shimmer-block bd-shimmer-log-line"></div>
              <div className="bd-shimmer-block bd-shimmer-log-line"></div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailShimmer;
