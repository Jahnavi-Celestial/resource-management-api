import React, { memo } from "react";
import "./HomeShimmer.css";

const HomeShimmer = memo(() => {
  return (
    <div className="shimmer-container">
      <header className="shimmer-header">
        <div>
          <div className="block title"></div>
          <div className="block subtitle"></div>
        </div>
        <div className="block shimmer-badge"></div>
      </header>

      <section className="shimmer-stats-section">
        <div className="shimmer-card">
          <div className="block card-title"></div>
          <div className="block card-badge"></div>
          <div className="block card-text"></div>
        </div>
        <div className="shimmer-card">
          <div className="block card-title"></div>
          <div className="block card-text-long"></div>
          <div className="block card-text"></div>
        </div>
        <div className="shimmer-card full-row-shimmer">
          <div className="shimmer-card-header-inline">
            <div className="block card-title"></div>
            <div className="block input-picker"></div>
          </div>
          <div className="stats-row">
            <div className="shimmer-stat-item"></div>
            <div className="shimmer-stat-item"></div>
            <div className="shimmer-stat-item"></div>
          </div>
        </div>
      </section>

      <div className="management-section">
        <section className="shimmer-section shimmer-card">
          <div className="shimmer-section-header">
            <div className="block section-title"></div>
            <div className="block filter"></div>
          </div>
          <div className="list">
            <div className="block datagrid-mock-row header"></div>
            <div className="block datagrid-mock-row"></div>
            <div className="block datagrid-mock-row"></div>
          </div>
        </section>

        <section className="shimmer-section shimmer-card">
          <div className="shimmer-section-header">
            <div className="block section-title"></div>
            <div className="block filter"></div>
          </div>
          <div className="list">
            <div className="block datagrid-mock-row header"></div>
            <div className="block datagrid-mock-row"></div>
            <div className="block datagrid-mock-row"></div>
          </div>
        </section>
      </div>
    </div>
  );
});

export default HomeShimmer;
