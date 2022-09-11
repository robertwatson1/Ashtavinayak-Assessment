import React, { useEffect, useState } from "react"
import {
  Container, Row, Form, Button, Spinner, Modal, Table, Dropdown,
} from "react-bootstrap"
import { ToastContainer, toast } from "react-toastify"
import axios from "axios"
import { SERVER_URL } from "../config"

let showFlag = false

export default function MainPage() {
  
  // Create Program Modal
  const [programShow, setProgramShow] = useState(false)
  const handleProgramClose = () => setProgramShow(false)
  const handleProgramShow = () => setProgramShow(true)
  
  const [programId, setProgramId] = useState(0)
  const [programName, setProgramName] = useState("")
  const [programExercise, setProgramExercise] = useState("")

  // true: add program, false: edit program
  const [modalSwitch, setModalSwitch] = useState(true)

  // Create Exercise Modal
  const [exerciseShow, setExerciseShow] = useState(false)
  const handleExerciseClose = () => setExerciseShow(false)
  const handleExerciseShow = () => setExerciseShow(true)
  
  const [exerciseId, setExerciseId] = useState(0)
  const [exerciseName, setExerciseName] = useState("")
  const [exerciseLength, setExerciseLength] = useState(0)

  // Submit Button Spinner
  const [isLoading, setIsLoading] = useState(false)

  // Get Programs for display in table
  const [programs, setPrograms] = useState([])

  // Get Exercises for display in table
  const [exercises, setExercises] = useState([])

  const initProgramValues = () => {
    // Set Init value
    setProgramId(0)
    setProgramName("")
    setProgramExercise("")
  }

  const addProgram = () => {
    setIsLoading(true)

    if ( programId === 0 || programName === ""/* || programExercise === ""*/ ) {
      setIsLoading(false)
      toast.error("Please input all informations.")
      return
    }

    const data = {
      id: programId,
      name: programName,
      // exercise: programExercise,
    }

    const url = modalSwitch ? "/program/create" : "/program/edit"

    axios
      .post(SERVER_URL + url, data)
      .then((res) => {
        if (res.data.status) {
          setTimeout(() => {
            setIsLoading(false)
            toast.success(res.data.message)

            // Get updated data
            showFlag = false
            setPrograms(res.data.data)
            
            initProgramValues()

            handleProgramClose()
          }, 2000)
        } else {
          setIsLoading(false)
          toast.error(res.data.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const addExercise = () => {
    setIsLoading(true)

    if ( exerciseId === 0 || exerciseName === "" || exerciseLength === "" ) {
      setIsLoading(false)
      toast.error("Please input all informations.")
      return
    }

    const data = {
      id: exerciseId,
      name: exerciseName,
      length: exerciseLength,
    }

    axios
      .post(SERVER_URL + "/exercise/create", data)
      .then((res) => {
        if (res.data.status) {
          setTimeout(() => {
            setIsLoading(false)
            toast.success(res.data.message)

            // Set Init value
            setExerciseId(0)
            setExerciseName("")
            setExerciseLength(0)

            handleExerciseClose()
          }, 2000)
        } else {
          setIsLoading(false)
          toast.error(res.data.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const deleteProgram = (id) => {
    if(!window.confirm("Are you going to delete this data?")) {
      return
    }

    const data = {
      id: id
    }

    axios
      .post(SERVER_URL + "/program/delete", data)
      .then((res) => {
        if (res.data.status) {
          setTimeout(() => {
            toast.success(res.data.message)

            //Get updated data
            showFlag = false
            setPrograms(res.data.data)
          }, 2000)
        } else {
          toast.error(res.data.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleEditProgram = (data) => {
    setProgramId(data.id)
    setProgramName(data.name)
    setProgramExercise(data.exercise)

    setModalSwitch(false)

    handleProgramShow()
  }

  useEffect(()=>{
    const loadPrograms = async () =>{
      await axios
      .get(SERVER_URL + "/program/get-data")
      .then(async (res) => {
        if (res.data.status) {
          const data = res.data.data
          setPrograms(data)
          console.log(programs)
          showFlag = true
        } else {
          toast.error(res.data.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })

      await axios
      .get(SERVER_URL + "/exercise/get-data")
      .then(async (res) => {
        if (res.data.status) {
          const data = res.data.data
          setExercises(data)
        } else {
          toast.error(res.data.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
    }
    
    loadPrograms()
  }, [showFlag])

  const onClickHandler = (e) => {
    const hiddenElement = e.currentTarget.nextSibling
    hiddenElement.className.indexOf("collapse show") >
    -1 ? hiddenElement.classList.remove("show") : hiddenElement.classList.add("show")
  };

  // Get Dropdown selected name
  const [exName, setExName] = useState("")
  const [exId, setExId] = useState(0)

  //Add Exercise to Program
  const addExerciseToProgram = (programId) => {
    if ( programId === 0 || exId === 0 ) {
      toast.error("Please select program or exercise to add.")
      return
    }

    const data = {
      programId: programId,
      exerciseId: exId,
    }

    axios
      .post(SERVER_URL + "/program/add-exercise", data)
      .then((res) => {
        if (res.data.status) {
          setTimeout(() => {
            setIsLoading(false)
            toast.success(res.data.message)

            setPrograms(res.data.data)
            handleExerciseClose()
          }, 2000)
        } else {
          setIsLoading(false)
          toast.error(res.data.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <>
    {showFlag ? 
    <div className="main overflow-hidden">
      <div className="main-form-content d-flex justify-content-center">
        {/**
         * Add Program Modal
         */}
        <Modal show={programShow} onHide={handleProgramClose}>
          <Modal.Header closeButton>{modalSwitch ? "Add" : "Edit"} Program</Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formProgramID">
                <Form.Label>Program ID</Form.Label>
                <Form.Control 
                  type="number" 
                  placeholder="Enter ID" 
                  value={programId}
                  onChange={(e) => {
                    setProgramId(e.target.value)
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formProgramName">
                <Form.Label>Program Name</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter Name" 
                  value={programName}
                  onChange={(e) => {
                    setProgramName(e.target.value)
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formProgramExercise">
                <Form.Label>Exercise</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter Exercise" 
                  value={programExercise}
                  onChange={(e) => {
                    setProgramExercise(e.target.value)
                  }}
                />
              </Form.Group>
              {isLoading ? 
                <Button variant="primary" disabled>
                  <Spinner animation="grow" />
                </Button>
              :
                <Button variant="primary" type="button" onClick={()=>addProgram()}>
                  {modalSwitch ? "Add" : "Edit"}
                </Button>
              }
            </Form>
          </Modal.Body>
        </Modal>

        {/**
         * Add Exercise Modal
         */}
        <Modal show={exerciseShow} onHide={handleExerciseClose}>
          <Modal.Header closeButton>Add Exercise</Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formExerciseID">
                <Form.Label>Exercise ID</Form.Label>
                <Form.Control 
                  type="number" 
                  placeholder="Enter ID" 
                  value={exerciseId}
                  onChange={(e) => {
                    setExerciseId(e.target.value)
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formExerciseName">
                <Form.Label>Exercise Name</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter Name" 
                  value={exerciseName}
                  onChange={(e) => {
                    setExerciseName(e.target.value)
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formExerciseLength">
                <Form.Label>Exercise Length(min)</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter Exercise Length" 
                  value={exerciseLength}
                  onChange={(e) => {
                    setExerciseLength(e.target.value)
                  }}
                />
              </Form.Group>
              {isLoading ? 
                <Button variant="primary" disabled>
                  <Spinner animation="grow" />
                </Button>
              :
                <Button variant="primary" type="button" onClick={()=>addExercise()}>
                  Submit
                </Button>
              }
            </Form>
          </Modal.Body>
        </Modal>

        <Container className="col-md-6 col-lg-6 col-sm-8 mt-5">
            <Row className="justify-content-center">
              <Button className="bg-primary-1 border border-0 mx-3 col-3 d-flex align-items-center justify-content-center p-2 fw-bold"
                onClick={ ()=>{
                  setModalSwitch(true)
                  initProgramValues()
                  handleProgramShow()
                } }>
                Create Program
              </Button>

              <Button className="bg-primary-2 border border-0 mx-3 col-3 d-flex align-items-center justify-content-center p-2 fw-bold"
                onClick={ ()=>handleExerciseShow() }>
                Create Exercise
              </Button>
            </Row>

            <Row className="mt-5">
              {/* <BootstrapTable keyField='id' columns={columns} data={programs} expandRow={ expandRow }/> */}
              <Table bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Program Name</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    programs.map((data, i)=>(
                      <>
                        <tr key={i} onClick={ onClickHandler }>
                          <td>{data.id}</td>
                          <td>{data.name}</td>
                          
                          <td>
                            <Button className="me-3" variant="warning" type="button" onClick={ ()=>handleEditProgram(data) }>Edit</Button>
                            <Button className="me-3" variant="danger" type="button" onClick={ ()=>deleteProgram(data.id) }>Delete</Button>
                          </td>
                        </tr>
                        <tr className="collapse">
                          <td colSpan="4">
                            <Dropdown className="d-flex justify-content-center">
                              <Dropdown.Toggle className="toggle d-flex">
                                <div id={"drop-toggle-"+i}>Exercise</div>
                              </Dropdown.Toggle>

                              <Dropdown.Menu className="menu">
                                {
                                  exercises.map((item, j) => (
                                    <Dropdown.Item className="item" key={j} onClick={() => {
                                      setExName(item.name)
                                      setExId(item.id)
                                      document.getElementById("drop-toggle-"+i).innerText = item.name
                                    }}>
                                      <div>{item.name}</div>
                                    </Dropdown.Item>
                                  ))
                                }
                              </Dropdown.Menu>

                              <Button className="mx-3" variant="success" type="button" onClick={ ()=>{
                                addExerciseToProgram(data.id)
                              } }>
                                Add
                              </Button>
                            </Dropdown>
                            
                            <Container className="col-sm-8 mt-4">
                              { data.exercise.length > 0 ? 
                              <Table bordered>
                                <thead>
                                  <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {
                                    data.exercise.map((el, i) => (
                                      <tr key={i}>
                                        <td>{el.id}</td>
                                        <td>{el.name}</td>
                                      </tr>
                                    ))
                                  }
                                </tbody>
                              </Table> : <></>}
                            </Container>
                          </td>
                        </tr>
                      </>
                      ))
                  }
                </tbody>
              </Table>
            </Row>
        </Container>
      </div>
      <ToastContainer/>
    </div>
    : <></>}
    </>
  )
}
