import React, {Component} from 'react';
import { Route, Link, BrowserRouter as Router, Switch, NavLink } from 'react-router-dom'
import NotFound from "./404Component";
class SideBar extends Component {
    render() {

        return (
           <div className="App-Sidebar">
               <div>
                   <h1>A-Seeker</h1>
               </div>
               <nav>
                   <ul>
                       <li>
                           <p><NavLink to = "/">Home</NavLink></p>
                       </li>
                       <li>
                           <p><NavLink to = "/transcriptions">Transcriptions</NavLink></p>
                       </li>
                       <li>
                           <p><NavLink to = "/account">Account</NavLink></p>
                       </li>
                   </ul>
               </nav>
           </div>

////  <Router>
//       <div>
//         <nav>
//           <ul>
//             <li>
//               <Link to="/">Home</Link>
//             </li>
//             <li>
//               <Link to="/about">About</Link>
//             </li>
//             <li>
//               <Link to="/users">Users</Link>
//             </li>
//           </ul>
//         </nav>
//
//         {/* A <Switch> looks through its children <Route>s and
//             renders the first one that matches the current URL. */}
//         <Switch>
//           <Route path="/about">
//             <About />
//           </Route>
//           <Route path="/users">
//             <Users />
//           </Route>
//           <Route path="/">
//             <Home />
//           </Route>
//         </Switch>
//       </div>
//     </Router>
        );
    }
}

export default SideBar;