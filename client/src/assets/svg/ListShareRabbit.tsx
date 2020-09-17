import React from 'react';
import rabbitUrl from '../img/rabbit.png';

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export const ListShareRabbit = React.memo<Props>(({ className = '', style = {} }) => {
  return (
    <>
      <svg
        width="90"
        height="90"
        viewBox="0 0 90 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={style}
      >
        <circle cx="44.5" cy="44.5" r="43.5" fill="url(#pattern0)" stroke="#F0F0F0" />
        <rect x="65.5" y="64.5" width="23.1818" height="23.1818" rx="11.5909" fill="white" />
        <g clipPath="url(#clip0)">
          <path
            d="M79.1809 71.4925L80.8531 73.1647L79.1809 74.8368"
            stroke="#42A4FF"
            strokeWidth="0.836074"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M73.3279 75.6729V74.8368C73.3279 74.3933 73.5041 73.968 73.8176 73.6544C74.1312 73.3408 74.5565 73.1646 75 73.1646H80.8525"
            stroke="#42A4FF"
            strokeWidth="0.836074"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M75 80.6893L73.3279 79.0171L75 77.345"
            stroke="#42A4FF"
            strokeWidth="0.836074"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M80.8525 76.5089V77.345C80.8525 77.7885 80.6764 78.2138 80.3628 78.5274C80.0492 78.841 79.6239 79.0172 79.1804 79.0172H73.3279"
            stroke="#42A4FF"
            strokeWidth="0.836074"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <rect x="65.5" y="64.5" width="23.1818" height="23.1818" rx="11.5909" stroke="#F0F0F0" />
        <defs>
          <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image0" transform="scale(0.005)" />
          </pattern>
          <clipPath id="clip0">
            <rect
              width="10.0329"
              height="10.0329"
              fill="white"
              transform="translate(72.0745 71.0745)"
            />
          </clipPath>
          <image id="image0" width="200" height="200" xlinkHref={rabbitUrl} />
        </defs>
      </svg>
    </>
  );
});
