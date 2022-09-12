import React, { useEffect, useState } from "react"
import {
  Container, Row, Form, Button, Spinner, Modal, Table, Dropdown,
} from "react-bootstrap"
import { ToastContainer, toast } from "react-toastify"
import { add_program, delete_program, add_exercise_to_program, get_programs } from "../api/program"
import { add_exercise, get_exercises } from "../api/exercise"


export default function MainPage() {
  const [showFlag, setShowFlag] = useState(false)
  // Create Program Modal
  const [programShow, setProgramShow] = useState(false)
  const handleProgramClose = () => setProgramShow(false)
  const handleProgramShow = () => setProgramShow(true)
  
  const [programId, setProgramId] = useState(0)
  const [programName, setProgramName] = useState("")

  // true: add program, false: edit program
  const [modalSwitch, setModalSwitch] = useState(true)

  // Create Exercise Modal
  const [exerciseShow, setExerciseShow] = useState(false)
  const handleExerciseClose = () => setExerciseShow(false)
  const handleExerciseShow = () => setExerciseShow(true)
  
  const [newExercise, setNewExercise] = useState({ id: 0, name: '', length: 0, photo: ''})
  const handleExercise = (e) => {
    setNewExercise({...newExercise, [e.target.name]: e.target.value})
  }

  const handleExercisePhoto = (e) => {
    setNewExercise({...newExercise, photo: e.target.files[0]})
  }

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
  }

  const addProgram = async () => {
    try {
      setIsLoading(true)

      if ( programId === 0 || programName === "" ) {
        setIsLoading(false)
        toast.error("Please input all informations.")
        return
      }

      const data = {
        id: programId,
        name: programName,
      }

      const result = await add_program(modalSwitch, data)
      if (result.status) {
          setIsLoading(false)
          toast.success(result.message)

          // Get updated data
          setPrograms(result.data)
          
          initProgramValues()

          handleProgramClose()
      } else {
        setIsLoading(false)
        toast.error(result.message)
      }
    } catch(err) {
      console.log(err)
    }
  }

  const addExercise = async () => {
    setIsLoading(true)

    if ( newExercise.id === 0 || newExercise.name === "" || newExercise.length === 0 || newExercise.photo === "") {
      setIsLoading(false)
      toast.error("Please input all informations.")
      return
    }

    let formData = new FormData()
    formData.append('photo', newExercise.photo)
    formData.append('id', newExercise.id)
    formData.append('length', newExercise.length)
    formData.append('name', newExercise.name)

    const res = await add_exercise(formData)
    if (res.status) {
        setIsLoading(false)
        toast.success(res.message)

        // Set Init value
        setNewExercise({id: 0, name: "", length: 0, photo: ""})

        handleExerciseClose()
    } else {
      setIsLoading(false)
      toast.error(res.message)
    }
  }

  const deleteProgram = async (id) => {
    if(!window.confirm("Are you going to delete this data?")) {
      return
    }

    const data = {
      id: id
    }

    const res = await delete_program(data)
      
    if (res.status) {
        toast.success(res.message)
        setPrograms(res.data)
    } else {
      toast.error(res.message)
    }
  }

  const handleEditProgram = (data) => {
    setProgramId(data.id)
    setProgramName(data.name)

    setModalSwitch(false)

    handleProgramShow()
  }

  useEffect(()=>{
    const loadPrograms = async () =>{
      const res = await get_programs()
      if (res.status) {
        const data = res.data
        setPrograms(data)

        setShowFlag(true)
      } else {
        toast.error(res.message)
      }

    const exData = await get_exercises()
      if (exData.status) {
        const data = exData.data
        setExercises(data)
      } else {
        toast.error(exData.message)
      }
    }
    
    loadPrograms()
  }, [showFlag])

  const onClickHandler = (e) => {
    const hiddenElement = e.currentTarget.nextSibling
    hiddenElement.className.indexOf("collapse show") >
    -1 ? hiddenElement.classList.remove("show") : hiddenElement.classList.add("show")
  };

  // Get Dropdown selected name
  const [exId, setExId] = useState(0)

  //Add Exercise to Program
  const addExerciseToProgram = async (programId) => {
    if ( programId === 0 || exId === 0 ) {
      toast.error("Please select program or exercise to add.")
      return
    }

    const data = {
      programId: programId,
      exerciseId: exId,
    }

    const res = await add_exercise_to_program(data)
    if (res.status) {
        setIsLoading(false)
        toast.success(res.message)

        setPrograms(res.data)
        handleExerciseClose()
    } else {
      setIsLoading(false)
      toast.error(res.message)
    }
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
                  name="id"
                  value={newExercise.id}
                  onChange={ handleExercise
                    // setExerciseId(e.target.value)
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formExerciseName">
                <Form.Label>Exercise Name</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter Name" 
                  name="name"
                  value={newExercise.name}
                  onChange={
                    handleExercise
                    // setExerciseName(e.target.value)
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formExerciseLength">
                <Form.Label>Exercise Length(min)</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter Exercise Length" 
                  name="length"
                  value={newExercise.length}
                  onChange={
                    handleExercise
                    // setExerciseLength(e.target.value)
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formExerciseImage">
                <Form.Label>Exercise Photo</Form.Label>
                <Form.Control 
                  type="file" 
                  placeholder="Enter Exercise Photo" 
                  name="photo"
                  onChange={
                    handleExercisePhoto
                    // setExercisePhoto(e.target.files[0])
                  }
                />
              </Form.Group>
              {isLoading ? 
                <Button variant="primary" disabled>
                  <Spinner animation="grow" />
                </Button>
              :
                <Button variant="primary" type="button" onClick={addExercise}>
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
                                    <th>length</th>
                                    <th>Photo</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {
                                    data.exercise.map((el, i) => (
                                      <tr key={i}>
                                        <td>{el.id}</td>
                                        <td>{el.name}</td>
                                        <td>{el.length}</td>
                                        <td><img src={el.photo} alt="" /></td>
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
