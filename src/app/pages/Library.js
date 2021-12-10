import { React, useEffect, useState } from 'react'
import CodeEditor from '@uiw/react-textarea-code-editor';
import { Nav, NavLink, NavItem, Collapse, Button, Card , Badge} from "reactstrap";
import { getLibraries } from '../../services/library.service';

function Library() {
     const [code, setCode] = useState(
          `function add(a, b) {\n  return a + b;\n}`
     );

     const [libraries, setLibraries] = useState([]);

     const [collapseId, setCollapseId] = useState();
     const [openedItem, setOpenedItem] = useState({});

     useEffect(() => {
          getInıtData()
     }, [])

     const getInıtData = async () => {
          const response = await getLibraries();
          setLibraries([...response.data])
     }

     const getItemDetail = async (item) => {
          const response = await getLibraries();
          setLibraries([...response.data])
     }

     return (
          <div className="content">
               <div className="row">
                    <div className="col-3">
                         <Nav vertical tag="nav">
                              <h2>Library</h2>
                              <NavItem>
                                   {
                                        libraries.map(library =>
                                             <span>
                                                  <Button
                                                  size="sm" 
                                                      color="info" className="animation-on-hover"
                                                       onClick={() => setCollapseId(collapseId === library._id ? '' : library._id)}
                                                       style={{
                                                            fontSize: '22px',
                                                            marginBottom: '1rem',
                                                            cursor: 'pointer',
                                                       }}
                                                  >
                                                      {library.name}
                                                  </Button>
                                                  {
                                                       library.library_items.map(item =>
                                                            collapseId === library._id &&
                                                            <Nav vertical tag="nav">
                                                                 <NavItem>
                                                                      <Button className="ml-5 btn-simple" size="sm" color="warning" onClick={() => setOpenedItem({...item})}>
                                                                           {item.name}
                                                                      </Button>
                                                                 </NavItem>
                                                            </Nav>
                                                       )
                                                  }
                                             </span>
                                        )
                                   }

                              </NavItem>
                         </Nav>
                    </div>
                    <div className="col-9">
                        { openedItem && openedItem._id &&
                             <div className="row">
                             <div className="col-8">
                                   <h2>{openedItem.name}</h2>
                                   <h5>Example</h5>
                                   <CodeEditor
                                   className="text-area"
                                        value={openedItem.codes}
                                        language="js"
                                        placeholder="Please enter JS code."
                                        onChange={(evn) => setCode(evn.target.value)}
                                        padding={15}
                                        style={{
                                             fontSize: 17,
                                             backgroundColor: "#27293d",
                                             fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                                             minHeight: '350px',
                                             borderRadius: '15px'
                                        }}
                                   />
                              </div>
                              <div className="col-4">
                                   <h2>Description</h2>
                                   <h5>-</h5>
                                   <textarea className="text-area" >{openedItem.description}</textarea>
                              </div>
                             </div>
                        }

                    </div>
               </div>
          </div>
     )
}

export default Library
