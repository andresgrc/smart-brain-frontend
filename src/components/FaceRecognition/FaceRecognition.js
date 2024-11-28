import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, boxes = [] }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img id="inputimage" alt="" src={imageUrl} width="500px" height="auto" />
        {boxes.length > 0 &&
          boxes.map((box, index) => (
            <div
              key={`box-${index}`} // Use a simpler, unique key for better performance
              className="bounding-box"
              style={{
                top: box?.topRow || 0,
                right: box?.rightCol || 0,
                bottom: box?.bottomRow || 0,
                left: box?.leftCol || 0,
              }}
            ></div>
          ))}
      </div>
    </div>
  );
};

export default FaceRecognition;
