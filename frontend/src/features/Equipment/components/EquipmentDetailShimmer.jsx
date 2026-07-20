import React from "react";
import "./EquipmentDetailShimmer.css";

const EquipmentDetailShimmer = () => {
  return (
    <div className="shimmer-eq-container">
      <header className="shimmer-eq-header">
        <div>
          <div className="shimmer-eq-wave shimmer-eq-title"></div>
          <div className="shimmer-eq-wave shimmer-eq-subtitle"></div>
        </div>
        <div className="shimmer-eq-wave shimmer-eq-header-actions"></div>
      </header>

      <div className="shimmer-eq-layout">
        <section className="shimmer-eq-card">
          <div className="shimmer-eq-wave shimmer-eq-name"></div>
          <div className="shimmer-eq-wave shimmer-eq-badge"></div>
          <div className="shimmer-eq-spec-list">
            <div className="shimmer-eq-wave shimmer-eq-spec-row"></div>
            <div className="shimmer-eq-wave shimmer-eq-spec-row"></div>
          </div>
        </section>

        <section className="shimmer-eq-card">
          <div className="shimmer-eq-panel-header">
            <div className="shimmer-eq-wave shimmer-eq-section-title"></div>
            <div className="shimmer-eq-wave shimmer-eq-counter"></div>
          </div>

          <div className="shimmer-eq-timeline">
            <div className="shimmer-eq-timeline-card">
              <div className="shimmer-eq-timeline-header">
                <div className="shimmer-eq-wave shimmer-eq-card-title"></div>
                <div className="shimmer-eq-wave shimmer-eq-status"></div>
              </div>
              <div className="shimmer-eq-wave shimmer-eq-text-line"></div>
              <div className="shimmer-eq-wave shimmer-eq-text-line"></div>
              <div className="shimmer-eq-wave shimmer-eq-text-line"></div>
            </div>

            <div className="shimmer-eq-timeline-card">
              <div className="shimmer-eq-timeline-header">
                <div className="shimmer-eq-wave shimmer-eq-card-title"></div>
                <div className="shimmer-eq-wave shimmer-eq-status"></div>
              </div>
              <div className="shimmer-eq-wave shimmer-eq-text-line"></div>
              <div className="shimmer-eq-wave shimmer-eq-text-line"></div>
              <div className="shimmer-eq-wave shimmer-eq-text-line"></div>
            </div>
          </div>

          <div className="shimmer-eq-wave shimmer-eq-toggle-btn"></div>
        </section>
      </div>
    </div>
  );
};

export default EquipmentDetailShimmer;
