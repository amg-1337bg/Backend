import Paper from "@mui/material/Paper"
import Grid from '@mui/material/Grid';
import { ErrorMessage, Field, Form, Formik } from "formik"
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import * as Yup from 'yup'
import { createRoom, RoomInfo } from "../requests/home";
import { setOpenDialogRoom } from "../store/openDialogReducer";
import { useDispatch } from "react-redux";
import { fetchRoomsHome } from "../store/FetchsReducer";

const FormNewRoom = () => {
    const dispatch = useDispatch();
    const paperStyle = { padding: '0px 15px 40px 15px', width: 320 }
    const btnStyle = { marginTop: '10px' }
    const initialValues: RoomInfo = {
        name: '',
        type: '',
        password: ''
    }
    const validationSchema = Yup.object().shape({
        name: Yup.string().min(5, "Name too short").required("Required").max(20, "Name too long"),
        type: Yup.string().required("Required"),
        password: Yup.string().min(8, "Minimum characters should be 8")
    })

    const onSubmit = (values: RoomInfo, props: any) => {
        createRoom(values);
        props.resetForm();
        dispatch(setOpenDialogRoom(false));
        FetchNewData();
    }

    var FetchNewData = function () {
        console.log('1');
        setTimeout(function () {
            dispatch(fetchRoomsHome());
        }, 250);
    }

    return (
        <Grid>
            <Paper elevation={0} sx={{ backgroundColor: "#130742" }} style={paperStyle}>
                <Grid alignContent='center' marginBottom='25px'>
                    <Typography variant='caption'>Fill the form to create a new room</Typography>
                </Grid>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {(props) => (
                        <Form>
                            <Field as={TextField} name='name' label='Room Name' fullWidth
                                error={props.errors.name && props.touched.name}
                                helperText={<ErrorMessage name='name' />} required />

                            <div id="my-radio-group" style={{ margin: "20px 4px 7px" }}>Room Visibility</div>
                            <div role="group" aria-labelledby="my-radio-group" style={{ marginBottom: "20px" }}>
                                <label>
                                    <Field type="radio" name="type" value="public" />
                                    Public
                                </label>
                                <label>
                                    <Field type="radio" name="type" value="protected" />
                                    Protected
                                </label>
                                <label>
                                    <Field type="radio" name="type" value="private" />
                                    Private
                                </label>
                            </div>

                            {props.values.type === "protected" &&
                                < Field as={TextField} name='password' label='Password' type='password' fullWidth
                                    error={props.errors.password && props.touched.password}
                                    helperText={<ErrorMessage name='password' />} required />
                            }
                            <Button type='submit' style={btnStyle} variant='contained'
                                color='primary' >Create Room</Button>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Grid>
    )
}

export default FormNewRoom