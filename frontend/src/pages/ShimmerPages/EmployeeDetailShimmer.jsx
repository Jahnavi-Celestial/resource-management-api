import React from "react";
import "./EmployeeDetailShimmer.css";

const EmployeeDetailShimmer = () => {
  return (
    <div className="shimmer-detail-container">
      <header className="shimmer-detail-header">
        <div className="shimmer-profile-title"></div>
        <div className="shimmer-profile-subtext"></div>
      </header>

      <div className="shimmer-detail-layout">
        <section className="shimmer-profile-card">
          <div className="shimmer-profile-avatar"></div>
          <div className="shimmer-profile-name"></div>
          <div className="shimmer-profile-badge"></div>

          <div className="shimmer-fields-list">
            <div className="shimmer-field-item"></div>
            <div className="shimmer-field-item"></div>
          </div>
        </section>

        <section className="shimmer-metrics-card">
          <div className="shimmer-metrics-title"></div>
          <div className="shimmer-metrics-box"></div>
        </section>
      </div>

      <div className="shimmer-action-buttons">
        <div className="shimmer-btn-group">
          <div className="shimmer-btn"></div>
          <div className="shimmer-btn"></div>
        </div>
        <div className="shimmer-btn-group">
          <div className="shimmer-btn"></div>
          <div className="shimmer-btn"></div>
        </div>
        <div className="shimmer-btn-group">
          <div className="shimmer-btn"></div>
          <div className="shimmer-btn"></div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailShimmer;
