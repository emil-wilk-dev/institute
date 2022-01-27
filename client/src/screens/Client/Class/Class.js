import React, { useEffect, useState } from "react";
import { NavLink as RouterLink, useHistory, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import { useSnackbar } from "notistack";
import ReactPlayer from "react-player";
import useAuth from "../../../hooks/useAuth";
import { isEmpty, dateTimeFormat } from "../../../utils/helpers";
import { Button } from '@material-ui/core';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ClassService from "../../../services/class.service";
import parse from 'html-react-parser';
import { pdfjs, Document, Page } from "react-pdf";
import SampleDocViewer from "../../../components/common/SampleDocViewer";


pdfjs
    .GlobalWorkerOptions
    .workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;



const useStyles = makeStyles((theme) => ({
    pageTitle: {
        marginBottom: theme.spacing(2),
        color: "black",
        fontSize: "14px"
    },
    root: {
        flexGrow: 1,
        padding: "40px 0px",
    },
    formControl: {
        display: "flex",
        flexDirection: "row",
        marginTop: "5px",
        fontSize: "14px",
        width: 200
    },
    headerWrap: {
        display: "flex",
        justifyContent: "space-between",
    },
    Logo: {
        width: 240,
        height: 240,
    },
    PDFViewer: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(2),
        marginLeft: theme.spacing(2),
    },
    highlightValue: {
        color: "gray",
        fontWeight: "400",
        fontSize: "small",
        whiteSpace: "pre-line"
    },
    highlighTitle: {
        color: "black",
        fontSize: "14px"
    }

}));


export default function Class() {

    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { user, logout } = useAuth();

    const [selectedProvider, setSelectedProvider] = useState({});

    const [completed, setCompleted] = useState(false);
    const [classData, setClassData] = useState([]);
    const [classId, setClassId] = useState();
    const [clientId, setClientId] = useState();
    const [totalPages, setTotalPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const loc = useLocation();

    const history = useHistory();

    const id = loc.pathname.split('/')[3];

    const handleSwitchChange = async (event) => {
        const data = {
            clientId: clientId,
            classId: classId,
            classUpdate: event.target.checked
        };

        classData.completion_dt = new Date();
        setCompleted(event.target.checked);

        try {

            const updateClass = await ClassService.updateClassCompletion(data);


            if (updateClass === '') {
                enqueueSnackbar(`Could not find your class details.`, {
                    variant: "warning",
                });
            } else {


                enqueueSnackbar(`Successfully updated the class details.`, {
                    variant: "success",
                });

                history.go(0);

            }


        } catch (error) {
            setErrors(error.response.data.message);
            enqueueSnackbar(`${error.response.data.message}`, {
                variant: "error",
            });
        }
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setTotalPages(numPages);
        setPageNumber(1);
    };

    const handleChange = (event, value) => {
        setPageNumber(value);
    };

    const onError = (e) => {
        enqueueSnackbar(e, { variant: "error" });
        console.error("onError", e);
    };

    const handlePrevious = () => {
        const prevId = parseInt(classId) - 1;
        history.push(`/client/class/${prevId}`);
    };

    const handleNext = () => {
        const nextId = parseInt(classId) + 1;
        history.push(`/client/class/${nextId}`);
    };

    const url =
        "http://www.pdf995.com/samples/pdf.pdf"

    useEffect(() => {

        setClassId(id);
        setClientId(user.id);
        ClassService.getClass(id).then(
            (response) => {
                if (response) {
                    console.log(response[0]);
                    setCompleted(response[0].completion_dt === null ? false : true)
                    setClassData(response[0]);
                }
            },
            (error) => {
                if (error.response) {
                    setErrors(error.response.data.message);
                }
            },
        );
    }, [])

    const highlightsVal = classData.length === 0 ? '' : classData.highlight === null ? '' : parse(classData.highlight);

    return (
        <div className={classes.root}>
            <Grid container >
                <Grid item md={7} xs={12} className={classes.headerWrap}>
                    <Typography color="textPrimary" className={classes.pageTitle}>
                        {classData.title}
                        {" "}
                        {!isEmpty(selectedProvider) && `- ${selectedProvider?.name}`}
                    </Typography>
                </Grid>
            </Grid>


            <Grid container spacing={1}>
                <Grid item md={9} xs={9}>
                    <Grid container spacing={1}>
                        {
                            classData.type === 'V' ?
                                <Grid item md={8} xs={8} >
                                    <ReactPlayer
                                        url={classData.url}
                                        width={500}
                                        controls={true}
                                    />
                                </Grid>
                                :
                                classData.type === 'P' ?
                                    <Grid item md={8} xs={8} >
                                        {/* <SampleDocViewer filePath={classData.url} /> */}
                                        <Document
                                            file={classData.url}
                                            onLoadSuccess={onDocumentLoadSuccess}
                                        >
                                            <Page pageNumber={pageNumber} />
                                        </Document>
                                    </Grid>
                                    :
                                    null
                        }

                        <Grid item md={4} xs={4} >
                            <Grid item md={12} xs={12} >
                                <FormControlLabel
                                    label="Completed: "
                                    labelPlacement="start"
                                    style={{ marginLeft: "0px" }}
                                    control={
                                        <Switch
                                            checked={completed}
                                            onChange={handleSwitchChange}
                                            name="completed"
                                            color="primary"

                                        />
                                    }
                                />
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <label style={{ fontSize: "14px" }}>Completion Date: {classData.completion_dt === null ? '-' : dateTimeFormat(classData.completion_dt)}</label>
                            </Grid>

                            <Grid item md={12} xs={12}>
                                <Button
                                    style={{ backgroundColor: '#2979ff', marginTop: '20px' }}
                                    variant="contained"
                                    color="secondary"
                                    onClick={handlePrevious}
                                >
                                    Previous
                                </Button>
                                <Button
                                    style={{ backgroundColor: '#2979ff', marginTop: '20px', marginLeft: '15px' }}
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleNext}
                                >
                                    Next
                                </Button>
                            </Grid>

                        </Grid>

                    </Grid>

                    <Grid container spacing={1} style={{ marginTop: "30px" }}>
                        <Grid item md={12} xs={12} >
                            <Typography className={classes.highlighTitle}> Highlights</Typography>
                        </Grid>
                        <Grid item md={12} xs={12}>
                            <p className={classes.highlightValue}> {highlightsVal}</p>
                        </Grid>
                    </Grid>
                </Grid>


            </Grid>

        </div>
    );
}
