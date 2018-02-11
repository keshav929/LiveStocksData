import { Component, OnInit } from '@angular/core';
import {$WebSocket, WebSocketSendMode} from 'angular2-websocket/angular2-websocket';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';
  stockData = [];

  ngOnInit() 
  {
     this.getStockData();
  }

  getStockData()
  {
    var ws = new $WebSocket("ws://stocks.mnet.website");

    ws.onMessage(
      (msg: MessageEvent)=> 
      {
          this.updateStockData(msg.data);
      },
      {autoApply: false}
    );
  }

  updateStockData(data)
  {

      let sData = JSON.parse(data);
      for (let i = 0; i < sData.length; i++) 
      {
        let singleData = sData[i];
        let isExist = false;
        for(let j = 0; j < this.stockData.length; j++)
        {
          if(this.stockData[j][0] == singleData[0])
          {
            isExist = true;
            let lastTime = '';
            if(singleData[1]>this.stockData[j][1])
            {
              this.stockData[j][4] = "riseUpdate";
            }
            else
            {
              this.stockData[j][4] = "fallUpdate";
            }
            this.stockData[j][1] = singleData[1];
            let currentTime = (new Date).getTime();
            this.stockData[j][3] = currentTime;
          }
        }
        if(!isExist)
        {
          let time = (new Date).getTime();
          let newArray = [];
          newArray.push(singleData[0]);
          newArray.push(singleData[1]);
          newArray.push("A few seconds ago");
          newArray.push(time);
          newArray.push("firstUpdate");
          this.stockData.push(newArray);
        }
        isExist = false;
      }

      for(let k = 0; k<this.stockData.length; k++)
      {
        let currentTime = (new Date).getTime();
        let timeDifference = currentTime - this.stockData[k][3];
        if(timeDifference < 60000)
        {
            
            if(Math.floor(timeDifference/1000)>3)
            {
                this.stockData[k][2] = Math.floor(timeDifference/1000)+" seconds ago";
            }
        }
        else if(timeDifference < 3600000)
        {
            this.stockData[k][2] = Math.floor(timeDifference/1000)+" minutes ago";
        }
        else if(timeDifference < 24*3600000)
        {
            let hours = this.stockData[k][3].getHours();
            let mid = this.getTimeSuffix(hours);
            let minutes = this.stockData[k][3].getMinutes();
            
            this.stockData[k][2] = hours+":"+minutes+" "+mid;
        }
        else
        {
            let hours = this.stockData[k][3].getHours();
            let mid = this.getTimeSuffix(hours);
            let minutes = this.stockData[k][3].getMinutes();
            let day = this.stockData[k][3].getDate();
            let month = this.stockData[k][3].getMonth();
            let year = this.stockData[k][3].getFullYear();
            this.stockData[k][2] = day+"-"+(month+1)+"-"+year+" "+hours+":"+minutes+" "+mid;
        }
      }
  }

  getTimeSuffix(hours)
  {
    hours = (hours+24-2)%24; 
    var mid='AM';
    if(hours==0)
    {
      hours=12;
    }
    else if(hours>12)
    {
      hours=hours%12;
      mid='PM';
    }
    return mid;
  }
}
