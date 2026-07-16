import React from "react";
import "./RoomShimmer.css";

const RoomShimmer = () => {
    const array = new Array(15).fill('')
  return (
    <div className="shimmer-rooms-container">
      <div className="shimmer-rooms-grid">
        {
            array.map((e, i) => {
                return (
                    <div className="shimmer-room-card" key={i}>
                        <div className="shimmer-elem shimmer-image"></div>
                        <div className="shimmer-elem shimmer-title-line"></div>
                        <div className="shimmer-elem shimmer-meta-line"></div>
                        <div className="shimmer-elem shimmer-button-placeholder"></div>
                    </div>
                )
            })
        }
      </div>
    </div>
  );
};

export default RoomShimmer;
