# MiakAPI for Node-RED

```
npm i node-red-contrib-miakapi
```

This package is an adaptation of MiakAPI for Node-RED.

## Miakapp
[Miakapp](https://miakapp.com/) is an easy way to create complete interfaces for your smart home.
A control panel allows you to manage users and their permissions.
Instant communications are provided by WebSockets between your clients
and your coordinator. A coordinator is used to dynamically edit content
of your pages. It communicates using MiakAPI.

## MiakAPI
[MiakAPI](https://npmjs.com/miakapi) is a Websockets-based protocol that allows communication between clients and the coordinator.

Available methods are :
- `getUsers` => Get the list of users in your home and their permissions
- `commit` => Send data (variables) to the clients (you can use restrictions for some users)
- `sendNotif` => Send a push notification to the client (if it hasn't disabled them from their settings)

Events are:
- `onUpdate` => When an update of home settings happens (user / group / permission update...)
- `onUserLogin` => When a user logs into your home
- `onUserAction` => When a user clicks a button or types text in an input

## Interface builder examples
Interface editor is a web HTML/CSS editor with snippets.
Here is an example of what we can build very fast.

__Screenshots:__

![BigGrid example screenshot](https://raw.githubusercontent.com/Miakapp/MiakAPI/main/screenshots/bigGrid.jpg)
![Form example screenshot](https://raw.githubusercontent.com/Miakapp/MiakAPI/main/screenshots/formExample.jpg)
![Properties&Tables example screenshot](https://raw.githubusercontent.com/Miakapp/MiakAPI/main/screenshots/properties%26table.jpg)

__Code:__
```html
<page id="pagename">
  <div class="block small">
    <div class="title">Big grid example</div>

    <div class="bigGrid">
      <div id="btn1" class="bigBtn" @click>
        <div class="bigBtnIcon">🔷</div>
        <div class="bigBtnText">Normal button</div>
      </div>
      <div id="btn2" class="bigBtn green" @click>
        <div class="bigBtnIcon">✔</div>
        <div class="bigBtnText">Green button</div>
      </div>
      <div id="btn3" class="bigBtn orange" @click>
        <div class="bigBtnIcon">🔶</div>
        <div class="bigBtnText">Orange button</div>
      </div>
      <div id="btn4" class="bigBtn red" @click>
        <div class="bigBtnIcon">❌</div>
        <div class="bigBtnText">Red button</div>
      </div>
      <div id="btn5" class="bigBtn disabled" @click>
        <div class="bigBtnIcon">🔒</div>
        <div class="bigBtnText">Disabled button</div>
      </div>
    </div>
  </div>

  <div class="separator"></div>

  <div class="block small">
    <div class="title">Form example</div>

    <div class="simpleInput">
      <div>Text example</div>
      <input id="textInput1" type="text" placeholder="Text" @watch>
    </div>

    <!-- Double columns -->
    <div class="twoColumns">
      <div class="simpleInput">
        <div>Select example</div>
        <select id="select1" @watch>
          <option value="value1">Choice 1</option>
          <option value="value2">Choice 2</option>
          <option value="value3">Choice 3</option>
          <option value="value4">Choice 4</option>
        </select>
      </div>

      <div class="simpleInput">
        <div>Number example</div>
        <input id="numberInput1" type="number" placeholder="Number" @watch>
      </div>
    </div>

    <div class="twoColumns">
      <div class="simpleInput">
        <div>Time example</div>
        <input id="timeInput1" type="time" @watch>
      </div>

      <div class="simpleInput">
        <div>Week example</div>
        <input id="weekInput1" type="week" @watch>
      </div>

      <div class="simpleInput">
        <div>Month example</div>
        <input id="monthInput1" type="month" @watch>
      </div>

      <div class="simpleInput">
        <div>Date example</div>
        <input id="dateInput1" type="date" @watch>
      </div>
    </div>

    <div class="simpleInput">
      <div>Datetime example</div>
      <input id="datetimeInput1" type="datetime-local" @watch>
    </div>

    <div class="twoColumns">
      <div id="redBtn" class="button red" @click>Red button</div>
      <div id="greenBtn" class="button green" @click>Green button</div>
    </div>
  </div>

  <div class="separator"></div>

  <div class="block small">
    <div class="title">Properties example</div>

    <div class="infoItem">
      <div>Example of property 1</div>
      <div>Value of property 1</div>
    </div>    
    <div class="infoItem">
      <div>Example of property 2</div>
      <div>Value of property 2</div>
    </div>    
    <div class="infoItem">
      <div>Example of property 3</div>
      <div>Value of property 3</div>
    </div>
    <div class="infoItem">
      <div>Example of property 4</div>
      <div>Value of property 4</div>
    </div>    
    <div class="infoItem">
      <div>Example of property 5</div>
      <div>Value of property 5</div>
    </div>

    <div class="separator"></div>

    <div class="twoColumns">
      <div id="normalBtn1" class="button" @click>Normal button</div>
      <div id="normalBtn2" class="button disabled" @click>Disabled button</div>
    </div>
  </div>

  <div class="separator"></div>

  <div class="block small">
    <div class="title">Table example</div>

    <table>
      <tr>
        <th>Column 1</th>
        <th>Column 2</th>
        <th>Column 3</th>
      </tr>
      <tr>
        <td>Line 1, Col 1</td>
        <td>Line 1, Col 2</td>
        <td>Line 1, Col 3</td>
      </tr>
      <tr class="clickable" id="line2" @click>
        <td>Line 2, Col 1</td>
        <td>Line 2, Col 2</td>
        <td>Line 2, Col 3</td>
      </tr>
    </table>

    <div id="addLineBtn" class="button green plusButton" @click>+</div>
  </div>
</page>

<style>
  #pagename {

  }
</style>
```
