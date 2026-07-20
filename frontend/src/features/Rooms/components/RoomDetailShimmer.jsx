import React from "react";
import "./RoomDetailShimmer.css"; 

const RoomDetailShimmer = () => {
  return (
    <div className="room-detail-container skeleton-wrapper">
      <header className="room-detail-header-skeleton">
        <div>
          <div className="skeleton-line header-title-shimmer" />
          <div className="skeleton-line header-subtext-shimmer" />
        </div>
        <div className="room-action-buttons-shimmer">
          <div className="skeleton-line btn-shimmer" />
          <div className="skeleton-line btn-shimmer" />
        </div>
      </header>

      <div className="skeleton-card info-panel-shimmer">
        <div className="skeleton-line title-shimmer" />
        <div className="skeleton-line pill-shimmer" />
      </div>

      <div className="room-spec-list-shimmer">
        {[1, 2, 3].map((item) => (
          <div key={item} className="spec-row-item-shimmer">
            <div className="skeleton-line label-shimmer" />
            <div className="skeleton-line value-shimmer" />
          </div>
        ))}
      </div>

      <div className="skeleton-card schedule-panel-shimmer">
        <div className="schedule-panel-header-shimmer">
          <div className="skeleton-line panel-title-shimmer" />
          <div className="skeleton-line badge-shimmer" />
        </div>

        <div className="schedule-timeline-list-shimmer">
          {[1, 2].map((card) => (
            <div key={card} className="timeline-card-shimmer">
              <div className="card-header-shimmer">
                <div className="skeleton-line card-title-shimmer" />
                <div className="skeleton-line card-pill-shimmer" />
              </div>
              <div className="card-details-shimmer">
                <div className="skeleton-line detail-line-shimmer" />
                <div className="skeleton-line detail-line-shimmer" />
                <div className="skeleton-line detail-line-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomDetailShimmer;
