import Axios from "./index"

export const add_program = async (modalSwitch, data) => {
    try {
        const url = modalSwitch ? "/program/create" : "/program/edit"

        const res = await Axios.post(url, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    } catch (e) {
        return null;
    }
}

export const delete_program = async (data) => {
    try {
        const res = await Axios.post("/program/delete", data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    } catch (e) {
        return null;
    }
}

export const add_exercise_to_program = async (data) => {
    try {
        const res = await Axios.post("/program/add-exercise", data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    } catch (e) {
        return null;
    }
}

export const get_programs = async () => {
    try {
        const res = await Axios.get("/program/get-data", {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    } catch (e) {
        return null;
    }
}