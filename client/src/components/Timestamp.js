import React from "react";

export function formatTimestamp(postedDate){
    const date = new Date(postedDate);
    const now = new Date();
    const diffInSeconds = Math.floor((now-date)/1000);//time is in milliseconds here, so converting to seconds
    const minutes = Math.floor(diffInSeconds/60);
    const hours = Math.floor(minutes/60);
    const days = Math.floor(hours/24);
    const months = Math.floor(days/30);
    const years = Math.floor(days/365);
    let timeString = "";
  
    if(diffInSeconds < 60){
      timeString = `${diffInSeconds} seconds ago`;
    } 
    else if(minutes<60){
      timeString = `${minutes} minutes ago`;
    }
    else if(hours<24){
      timeString = `${hours} hours ago`;
    }
    else if(days<30){
      timeString = `${days} days ago`;
    }
    else if(months<12){
      timeString = `${months} months ago`;
    }
    else{
      timeString = `${years} years ago`;
    }
    return <span>{timeString}</span>;
  }