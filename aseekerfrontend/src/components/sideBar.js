import React, {Component} from 'react';

class SideBar extends Component {
    render() {

        return (
           <div className="App-Sidebar">
               <div>
                   <h2>A-Seeker</h2>
               </div>

               <ul>
                   <li>
                       <p>Home</p>
                   </li>
                   <li>
                       <p>Transcriptions</p>
                   </li>
                   <li>
                       <p>Account</p>
                   </li>
               </ul>
           </div>

        );
    }
}

export default SideBar;