import React, {useState, useEffect} from 'react';
import {Card,CardBody, FormGroup, Label, Input, InputGroup,
    InputGroupText,
    InputGroupButtonDropdown,
    InputGroupAddon,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem} from 'reactstrap';
import MatButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import axios from "axios";
import { toast} from "react-toastify";
import { url as baseUrl, token } from "../../../api";
//import { useHistory } from "react-router-dom";
import 'react-summernote/dist/react-summernote.css'; // import styles
import { Spinner } from "reactstrap";
import moment from "moment";

const useStyles = makeStyles(theme => ({
    card: {
        margin: theme.spacing(20),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    cardBottom: {
        marginBottom: 20
    },
    Select: {
        height: 45,
        width: 350
    },
    button: {
        margin: theme.spacing(1)
    },

    root: {
        '& > *': {
            margin: theme.spacing(1)
        },
        "& .card-title":{
            color:'#fff',
            fontWeight:'bold'
        },
        "& .form-control":{
            borderRadius:'0.25rem',
            height:'41px'
        },
        "& .card-header:first-child": {
            borderRadius: "calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0"
        },
        "& .dropdown-toggle::after": {
            display: " block !important"
        },
        "& select":{
            "-webkit-appearance": "listbox !important"
        },
        "& p":{
            color:'red'
        },
        "& label":{
            fontSize:'14px',
            color:'#014d88',
            fontWeight:'bold'
        }
    },
    input: {
        display: 'none'
    }, 
    error: {
        color: "#f85032",
        fontSize: "11px",
    },
    success: {
        color: "#4BB543 ",
        fontSize: "11px",
    },
}))

const ClinicEvaluationFrom = (props) => {
    const patientObj = props.patientObj;
    //let history = useHistory();
    const classes = useStyles()
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const [splitButtonOpen, setSplitButtonOpen] = React.useState(false);
    const toggleDropDown = () => setDropdownOpen(!dropdownOpen);
    //const [values, setValues] = useState([]);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [objValues, setobjValues] = useState({next_appointment:""});
    const [generalApperance, setGeneralApperance] = useState({
            nsf: "",
            pallor: "",
            febrile: "",
            dehydrated: "",
            peripheral: "",
            other: ""
    });
    const [patientDisclosure, setPatientDisclosure] = useState(
            {
                no_one:"",
                family_member: "",
                friend: "",
                spouse: "",
                spiritual_leader: "",
                others: ""
            }
    );
    const [currentMedical, setCurentMedical] = useState({ none: "",
            ART: "",
            CTX: "",
            ant_tb_drugs: "",
            others: ""
    });
    const [pastArvMedical, setPastArvMedicalMedical] = useState({});
    const [medicalHistory, setMedicalHistory] = useState({});
    const [skin, setSkin] = useState({
        nsf: "",
        pruritic: "",
        abscesses: "",
        herpes: "",
        kaposi: "",
        suborrheic: "",
        fungal: "",
        other: ""
    });
    const [eye, setEye] = useState({
        nsf: "",
        icterus: "",
        thrush: "",
        oral: "",
        abnormal: "",
        other: ""
    });
    const [breast, setBreast] = useState({
        nsf: "",
        lumps: "",
        discharge: "",
        other: ""
    });
    const [cardiovascular, setCardiovascular] = useState({});
    const [genitalia, setGenitalia] = useState({});
    const [respiratory, setRespiratory] = useState({});
    const [gastrointestinal, setGastrointestinal] = useState({});
    const [neurological, setNeurological] = useState({});
    const [mentalStatus, setMentalStatus] = useState({});
    const [assesment, setAssesment] = useState({});
    const [who, setWho] = useState({stage:"", value:""});
    const [regimen, setRegimen] = useState({regimenLine:"", regimen:""});
    const [plan, setPlan] = useState({});
    const [enroll, setEnroll] = useState({});
    const [planArt, setPlanArt] = useState({});

    //hide operations
    const [hideOtherPatientDisclosure, setHideOtherPatientDisclosure]=useState(false)
    const [hideOtherCurrentMedication, setHideOtherCurrentMedication]=useState(false)
    const [hideOtherPastArv, setHideOtherPastArv]=useState(false)
    const [hideStage1, setHideStage1] = useState(false);
    const [hideStage2, setHideStage2] = useState(false);
    const [hideStage3, setHideStage3] = useState(false);
    const [hideStage4, setHideStage4] = useState(false);
    const [hideFirstLine, setHideFirstLine] = useState(false);
    const [hideSecondLine, setHideSecondLine] = useState(false);
    const [hideThirdLine, setHideThirdLine] = useState(false);
    const [hideGeneralApperance, setHideGeneralApperance]=useState(false)
    const [hideSkin, setHideSkin] = useState(false)
    const [hideEye, setHideEye] = useState(false)
    const [hideBreast, setHideBreast] = useState(false)
    const [hideCardiovascular, setHideCardiovascular] = useState(false)
    const [hideGenitalia, setHideGenitalia] = useState(false);
    const [hideRespiratory, setHideRespiratory] = useState(false);
    const [hideGastrointestinal, setHideGastrointestinal] = useState(false);
    const [hideNeurological, setHideNeurological] = useState(false);
    const [handlementalstatus, setHideMentalStatus] = useState(false);
    const [hidecd4CountQuantitative, setHidecd4CountQuantitative] = useState(false);
    const [hidecd4CountFlow, setHidecd4CountFlow] = useState(false);
    const [vital, setVitalSignDto]= useState({
        bodyWeight: "",
        diastolic:"",
        encounterDate: "",
        facilityId: 1,
        height: "",
        personId: props.patientObj.id,
        serviceTypeId: 1,
        systolic:"",
        pulse:"",
        temperature:"",
        respiratoryRate:"" 
    })
//Vital signs clinical decision support 
const [vitalClinicalSupport, setVitalClinicalSupport] = useState({
                                bodyWeight: "",
                                diastolic: "",
                                height: "",
                                systolic: "",
                                pulse:"",
                                temperature:"",
                                respiratoryRate:""
                            })
    const handleInputChangeobjValues = e => {            
        setobjValues ({...objValues,  [e.target.name]: e.target.value});
    }
    const [observation, setObservation]=useState({
        data: {
                medicalHistory:"",
                currentMedical:"",
                patientDisclosure:"",
                pastArvMedical:"",
                generalApperance:"",
                skin:"",
                eye:"",
                breast:"",
                cardiovascular:"",
                genitalia:"",
                respiratory:"",
                gastrointestinal:"",
                assesment :"",
                who:"",
                plan:"",
                regimen:"",
                enroll:"",
                planArt:"" ,
                next_appointment:"",
                neurological:"",
                mentalstatus:"",
                visitDate:""           
        },
        dateOfObservation: null,
        facilityId: null,
        personId: 0,
        type: "Clinical evaluation",
        visitId: null
    })

    //Handle CheckBox 
    const handleMedicalHistory =e =>{
        setMedicalHistory({...medicalHistory, [e.target.name]: e.target.value})
    }
    const handleCurrentMedicalHistory =e =>{
        if(e.target.name==='none'){
            if(e.target.checked){
                setHideOtherCurrentMedication(true)

                }else{
                    setHideOtherCurrentMedication(false)
                }
        }
        setCurentMedical({...currentMedical, [e.target.name]: e.target.value})

    }
    const handleDisclosure =e =>{
        if(e.target.name==='no_one'){
            if(e.target.checked){
            setHideOtherPatientDisclosure(true)
                }else{
                    setHideOtherPatientDisclosure(false)
                }
        }        
        setPatientDisclosure({...patientDisclosure, [e.target.name]: e.target.value})
    }
    const handlePastArv =e =>{
        if(e.target.name==='none'){
            if(e.target.checked){
                setHideOtherPastArv(true)
                }else{
                    setHideOtherPastArv(false)
                }
        }
    setPastArvMedicalMedical({...pastArvMedical, [e.target.name]: e.target.value})
    }
            //to check the input value for clinical decision 
            const handleInputValueCheckHeight =(e)=>{
                if(e.target.name==="height" && (e.target.value < 48.26 || e.target.value>216.408)){
                const message ="Height cannot be greater than 216.408 and less than 48.26"
                setVitalClinicalSupport({...vitalClinicalSupport, height:message})
                }else{
                setVitalClinicalSupport({...vitalClinicalSupport, height:""})
                }
            }
            const handleInputValueCheckBodyWeight =(e)=>{
                if(e.target.name==="bodyWeight" && (e.target.value < 3 || e.target.value>150)){      
                const message ="Body weight must not be greater than 150 and less than 3"
                setVitalClinicalSupport({...vitalClinicalSupport, bodyWeight:message})
                }else{
                setVitalClinicalSupport({...vitalClinicalSupport, bodyWeight:""})
                }
            }
            const handleInputValueCheckSystolic =(e)=>{
                if(e.target.name==="systolic" && (e.target.value < 90 || e.target.value>240)){      
                const message ="Blood Pressure systolic must not be greater than 240 and less than 90"
                setVitalClinicalSupport({...vitalClinicalSupport, systolic:message})
                }else{
                setVitalClinicalSupport({...vitalClinicalSupport, systolic:""})
                }
            }
            const handleInputValueCheckDiastolic =(e)=>{
                if(e.target.name==="diastolic" && (e.target.value < 60 || e.target.value>140)){      
                const message ="Blood Pressure diastolic must not be greater than 140 and less than 60"
                setVitalClinicalSupport({...vitalClinicalSupport, diastolic:message})
                }else{
                setVitalClinicalSupport({...vitalClinicalSupport, diastolic:""})
                }
            }
            const handleInputValueCheckPulse =(e)=>{
                if(e.target.name==="pulse" && (e.target.value < 40 || e.target.value>120)){      
                const message ="Pulse must not be greater than 120 and less than 40"
                setVitalClinicalSupport({...vitalClinicalSupport, pulse:message})
                }else{
                setVitalClinicalSupport({...vitalClinicalSupport, pulse:""})
                }
            }
            const handleInputValueCheckRespiratoryRate =(e)=>{
                if(e.target.name==="respiratoryRate" && (e.target.value < 10 || e.target.value>70)){      
                const message ="Respiratory Rate must not be greater than 70 and less than 10"
                setVitalClinicalSupport({...vitalClinicalSupport, respiratoryRate:message})
                }else{
                setVitalClinicalSupport({...vitalClinicalSupport, respiratoryRate:""})
                }
            }
            const handleInputValueCheckTemperature =(e)=>{
                if(e.target.name==="temperature" && (e.target.value < 35 || e.target.value>47)){      
                const message ="Temperature must not be greater than 47 and less than 35"
                setVitalClinicalSupport({...vitalClinicalSupport, temperature:message})
                }else{
                setVitalClinicalSupport({...vitalClinicalSupport, temperature:""})
                }
            }
    const handleGeneralApperance =e =>{
        if(e.target.name==='nsf'){
            if(e.target.checked){
                setHideGeneralApperance(true)
                }else{
                    setHideGeneralApperance(false)
                }
        }
        setGeneralApperance({...generalApperance, [e.target.name]: e.target.value})
    }
    const handleSkin =e =>{
        if(e.target.name==='nsf'){
            if(e.target.checked){
                    setHideSkin(true)
            }else{
                setHideSkin(false)
            }
        }
        setSkin({...skin, [e.target.name]: e.target.value})
    }
    const handleEye =e =>{
        if(e.target.name==='nsf'){
            if(e.target.checked){
                setHideEye(true)
            }else{
                setHideEye(false)
            }
        }
        setEye({...eye, [e.target.name]: e.target.value})
    }
    const handleBreast =e =>{
        if(e.target.name==='nsf'){
            if(e.target.checked){
                setHideBreast(true)
            }else{
                setHideBreast(false)
            }
        }
        setBreast({...breast, [e.target.name]: e.target.value})
        console.log(breast)
    }
    const handleCardiovascular =e =>{
        if(e.target.name==='nsf'){
            if(e.target.checked){
                setHideCardiovascular(true)
            }else{
                setHideCardiovascular(false)
            }
        }
        setCardiovascular({...cardiovascular, [e.target.name]: e.target.value})
        console.log(cardiovascular) 
    }
    const handleGenitalia =e =>{
        if(e.target.name==='nsf'){
            if(e.target.checked){
                setHideGenitalia(true)
            }else{
                setHideGenitalia(false)
            }
        }
        setGenitalia({...genitalia, [e.target.name]: e.target.value})
        console.log(genitalia)
    }
    const handleRespiratory =e =>{
        if(e.target.name==='nsf'){
            if(e.target.checked){
                setHideRespiratory(true)
            }else{
                setHideRespiratory(false)
            }
        }
        setRespiratory({...respiratory, [e.target.name]: e.target.value})
        
    }
    const handleGastrointestinal =e =>{
        if(e.target.name==='nsf'){
            if(e.target.checked){
                setHideGastrointestinal(true)
            }else{
                setHideGastrointestinal(false)
            }
        }
        setGastrointestinal({...gastrointestinal, [e.target.name]: e.target.value})
       
    }
    const handleNeurological =e =>{
        if(e.target.name==='nsf'){
            if(e.target.checked){
                setHideNeurological(true)
            }else{
                setHideNeurological(false)
            }
        }
        setNeurological({...neurological, [e.target.name]: e.target.value})
       
    }
    const handleMentalStatus =e =>{
        if(e.target.name==='nsf'){
            if(e.target.checked){
                setHideMentalStatus(true)
            }else{
                setHideMentalStatus(false)
            }
        }
        setMentalStatus({...mentalStatus, [e.target.name]: e.target.value})
       
    }
    const handleAssessment =e =>{
        setAssesment({...assesment, [e.target.name]: e.target.value})
        
    }
    const handleWho =e =>{
        if(e.target.value==="stage 1"){
            setHideStage1(true)
            setHideStage2(false)
            setHideStage3(false)
            setHideStage4(false)
        }else if(e.target.value==="stage 2"){
            setHideStage1(false)
            setHideStage2(true)
            setHideStage3(false)
            setHideStage4(false)

        }else if(e.target.value==="stage 3"){
            setHideStage1(false)
            setHideStage2(false)
            setHideStage3(true)
            setHideStage4(false)

        }else if(e.target.value==="stage 4"){
            setHideStage1(false)
            setHideStage2(false)
            setHideStage3(false)
            setHideStage4(true)

        }else{
            setHideStage1(false)
            setHideStage2(false)
            setHideStage3(false)
            setHideStage4(false)
        }
        setWho({...who, [e.target.name]: e.target.value})
    }

    const handlePlan =e =>{
        if(e.target.name==='cd4Count' && e.target.value==='Semi-Quantitative'){ 
                        
                setHidecd4CountQuantitative(true)
        }else{
            setHidecd4CountQuantitative(false)
        }
        if(e.target.name==='cd4Count' && e.target.value==='Flow Cyteometry'){          
            setHidecd4CountFlow(true)
        }else{
            setHidecd4CountFlow(false)
        }
        setPlan({...plan, [e.target.name]: e.target.value})
        //console.log(plan)
    }
    const handleRegimen =e =>{
        if(e.target.value==='first line'){
            setHideFirstLine(true)
            setHideSecondLine(false)
            setHideThirdLine(false)
        }else if(e.target.value==='second line'){
            setHideFirstLine(false)
            setHideSecondLine(true)
            setHideThirdLine(false)

        }else if(e.target.value==='third line'){
            setHideFirstLine(false)
            setHideSecondLine(false)
            setHideThirdLine(true)

        }else{
            setHideFirstLine(false)
            setHideSecondLine(false)
            setHideThirdLine(false)

        }
        setRegimen({...regimen, [e.target.name]: e.target.value})
    }

    const handleEnroll =e =>{
        setEnroll({...enroll, [e.target.name]: e.target.value})
        console.log(enroll)
    }
    const handlePlanArt =e =>{
        setPlanArt({...planArt, [e.target.name]: e.target.value})
        
    }

     /**** Submit Button Processing  */
     const handleSubmit = (e) => { 
        e.preventDefault(); 
        observation.dateOfObservation= moment(new Date()).format("YYYY-MM-DD")       
        observation.personId =patientObj.id
        observation.data.medicalHistory=medicalHistory
        observation.data.currentMedical=currentMedical
        observation.data.patientDisclosure=patientDisclosure
        observation.data.pastArvMedical=pastArvMedical
        observation.data.generalApperance=generalApperance
        observation.data.skin=skin
        observation.data.eye=eye
        observation.data.breast=breast
        observation.data.cardiovascular= cardiovascular
        observation.data.genitalia=genitalia
        observation.data.neurological=neurological
        observation.data.mentalstatus=mentalStatus
        observation.data.respiratory=respiratory
        observation.data.gastrointestinal = gastrointestinal
        observation.data.assesment = assesment
        observation.data.who=who
        observation.data.plan=plan
        observation.data.regimen=regimen
        observation.data.enroll=enroll
        observation.data.planArt= planArt
        observation.data.next_appointment=objValues.next_appointment
               
        e.preventDefault();                    
        setSaving(true);
        axios.post(`${baseUrl}observation`, observation,
        { headers: {"Authorization" : `Bearer ${token}`}},            
        )
          .then(response => {
              setSaving(false);
              props.patientObj.clinicalEvaluation=true
              toast.success("Initial Clinic Evaluation successful");
              props.setActiveContent({...props.activeContent, route:'recent-history'})
          })
          .catch(error => {
              setSaving(false);
              if(error.response && error.response.data){
                let errorMessage = error.response.data && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
                toast.error(errorMessage); 
            }
             
          });
      
    }

console.log(props.patientObj)
  return (      
      <div >
                   
        <Card className={classes.root}>
            <CardBody>
            <form >
                <div className="row">
                    <h2>Adult- Initial Clinical Evaluation </h2>
                    <div className="row">
                    <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                            <Label >Visit Date</Label>
                            <InputGroup> 
                                <Input 
                                    type="date"
                                    max= {moment(new Date()).format("YYYY-MM-DD") }
                                    name="visitDate"
                                    id="visitDate"
                                    value={objValues.visitDate}
                                    onChange={handleInputChangeobjValues} 
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-8"></div>   
                    </div>
                    <h4>Medical History</h4>
                    {/* Medical History form inputs */}
                        <div className="form-group mb-3 col-md-2"> 
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Fever/Chills
                            </label>                                      
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                                
                                name="fever"
                                id="fever"
                                onChange={handleMedicalHistory}
                                />
                                
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                            <Label >Duration</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="fever_duration"
                                    id="fever_duration"
                                    onChange={handleMedicalHistory}
                                    //value={objValues.encounterDate} 
                                />

                            </InputGroup>
                        
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-2"> 
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Nausea/Vomitiing
                            </label>                                      
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                                
                                name="Nausea"
                                id="Nausea"
                                onChange={handleMedicalHistory}
                                />
                                
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                            <Label >Duration</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="Nausea_fever"
                                    id="Nausea_fever"
                                    onChange={handleMedicalHistory}
                                    //value={objValues.encounterDate} 
                                />

                            </InputGroup>
                        
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-2"> 
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Night Sweats
                            </label>                                      
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                                
                                name="night_sweats"
                                id="night_sweats"
                                />
                                
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                            <Label >Duration</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="night_duration"
                                    id="night_duration"
                                    onChange={handleMedicalHistory}
                                    //value={objValues.encounterDate} 
                                />

                            </InputGroup>
                        
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-2"> 
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Recent Weight Loss
                            </label>                                      
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                                
                                name="recent"
                                id="recent"
                                onChange={handleMedicalHistory}
                                />
                                
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                            
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="recent_duration"
                                    id="recent_duration"
                                    onChange={handleMedicalHistory}
                                    //value={objValues.encounterDate} 
                                />

                            </InputGroup>
                        
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-2"> 
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Cough
                            </label>                                      
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                                
                                name="cough"
                                id="cough"
                                onChange={handleMedicalHistory}
                                />
                                
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                           
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="cough_duration"
                                    id="cough_duration"
                                    onChange={handleMedicalHistory}
                                   
                                />

                            </InputGroup>
                        
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-2"> 
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Headache
                            </label>                                      
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                                
                                name="headache"
                                id="headache"
                                onChange={handleMedicalHistory}
                                />
                                
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                           
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="headache_duration"
                                    id="headache_duration"
                                    onChange={handleMedicalHistory} 
                                />

                            </InputGroup>
                        
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-2"> 
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                New Visual imparity
                            </label>                                      
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                                
                                name="new_visual"
                                id="new_visual"
                                onChange={handleMedicalHistory} 
                                />
                                
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                           
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="new_visual_duration"
                                    id="new_visual_duration"
                                    onChange={handleMedicalHistory}  
                                />

                            </InputGroup>
                        
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-2"> 
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Pain & Difficulty when swallowing 
                            </label>                                      
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                                
                                name="pain"
                                id="pain"
                                onChange={handleMedicalHistory} 
                                />
                                
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                            
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="pain_duration"
                                    id="pain_duration"
                                    onChange={handleMedicalHistory}  
                                />

                            </InputGroup>
                        
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-2"> 
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Rash
                            </label>                                      
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                                
                                name="rash"
                                id="rash"
                                onChange={handleMedicalHistory} 
                                />
                                
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                            
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="rash_duration"
                                    id="rash_duration"
                                    onChange={handleMedicalHistory}  
                                />

                            </InputGroup>
                        
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-2"> 
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Itching
                            </label>                                      
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                                
                                name="itching"
                                id="itching"
                                onChange={handleMedicalHistory} 
                                />
                                
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                           
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="itching_duration"
                                    id="itching_duration"
                                    onChange={handleMedicalHistory}  
                                />

                            </InputGroup>
                        
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-2"> 
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Chronic Diarrhea
                            </label>                                      
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                                
                                name="chronic"
                                id="chronic"
                                onChange={handleMedicalHistory} 
                                />
                                
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                           
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="chronic_duration"
                                    id="chronic_duration"
                                    onChange={handleMedicalHistory}  
                                />

                            </InputGroup>
                        
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-2"> 
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Genital itching
                            </label>                                      
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                                
                                name="genital"
                                id="genital"
                                onChange={handleMedicalHistory} 
                                />
                                
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                           
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="genital_duration"
                                    id="genital_duration"
                                    onChange={handleMedicalHistory} 
                                />

                            </InputGroup>
                        
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-2"> 
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Genital Sores
                            </label>                                      
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                                
                                name="genital_score"
                                id="genital_score"
                                onChange={handleMedicalHistory} 
                                />
                                
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                           
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="genital_score_duration"
                                    id="genital_score_duration"
                                    onChange={handleMedicalHistory}  
                                />

                            </InputGroup>
                        
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-2"> 
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Shortness of breath
                            </label>                                      
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                                
                                name="shortness_of_breath"
                                id="shortness_of_breath"
                                onChange={handleMedicalHistory} 
                                />
                                
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                            
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="shortness_of_breath_duration"
                                    id="shortness_of_breath_duration"
                                    onChange={handleMedicalHistory} 
                                />

                            </InputGroup>
                        
                            </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-2"> 
                            <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Numbness/tingling
                            </label>                                      
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                                
                                name="numbness"
                                id="numbness"
                                onChange={handleMedicalHistory} 
                                />
                                
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                          
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="numbness_duration"
                                    id="numbness_duration"
                                    onChange={handleMedicalHistory}  
                                />

                            </InputGroup>
                        
                            </FormGroup>
                        </div>

                    {/* end of medical form inputs */}
                    <br/>
                     {/* TB Screening section */}
                     <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Patient Screen for TB</Label>
                            <InputGroup> 
                                <Input 
                                    type="select"
                                    name="screen_for_tb"
                                    id="screen_for_tb"
                                    onChange={handleMedicalHistory}  
                                >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                </Input>

                            </InputGroup>
                        
                            </FormGroup>
                     </div>
                    {/* end of TB Screening section */}
                    {/* Past medical history */}
                    <div className="form-group mb-3 col-md-12">
                            <FormGroup>
                            <Label >Past Medical History</Label>
                            <InputGroup> 
                                <Input 
                                    type="textarea"
                                    name="past_medical_history"
                                    id="past_medical_history"
                                    onChange={handleMedicalHistory}   
                                />

                            </InputGroup>
                        
                            </FormGroup>
                    </div>
                    {/* end of Past medical history  */}
                    {/* Past Family medical history */}
                    <div className="form-group mb-3 col-md-12">
                            <FormGroup>
                            <Label >Relevant Family History</Label>
                            <InputGroup> 
                                <Input 
                                    type="textarea"
                                    name="relevant_family_history"
                                    id="relevant_family_history"
                                    onChange={handleMedicalHistory}  
                                />

                            </InputGroup>
                        
                            </FormGroup>
                    </div>
                    {/* end of FamilyPast medical history  */}
                    {/* hospitalization */}
                    <div className="form-group mb-3 col-md-12">
                            <FormGroup>
                            <Label >Hospitalization</Label>
                            <InputGroup> 
                                <Input 
                                    type="textarea"
                                    name="hospitalization"
                                    id="hospitalization"
                                    onChange={handleMedicalHistory}  
                                />

                            </InputGroup>
                        
                            </FormGroup>
                    </div>
                    {/* end of hosiptalization */}
                    {/* Drug Allergies */}
                    <div className="form-group mb-3 col-md-12">
                            <FormGroup>
                            <Label >Drug Allergies</Label>
                            <InputGroup> 
                                <Input 
                                    type="textarea"
                                    name="drug_allergies"
                                    id="drug_allergies"
                                    onChange={handleMedicalHistory} 
                                />

                            </InputGroup>
                        
                            </FormGroup>
                    </div>
                    {/* end of Drug Allergies  */}
                    {props.patientObj.sex==='Female' && (<>
                        <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                <Label >Current Pregnant</Label>
                                <InputGroup> 
                                    <Input 
                                        type="select"
                                        name="current_pregnant"
                                        id="current_pregnant"
                                        onChange={handleMedicalHistory} 
                                    >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                    <option value="Uncertain">Uncertain</option>
                                    </Input>

                                </InputGroup>
                            
                                </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                <Label >Last menstrual period</Label>
                                <InputGroup> 
                                    <Input 
                                        type="date"
                                        name="last_menstrual_period"
                                        id="last_menstrual_period"
                                        onChange={handleMedicalHistory}  
                                    />

                                </InputGroup>
                            
                                </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                <Label >Gestational Age (weeks)</Label>
                                <InputGroup> 
                                    <Input 
                                        type="text"
                                        name="gestational_age"
                                        id="gestational_age"
                                        onChange={handleMedicalHistory} 
                                    />

                                </InputGroup>
                            
                                </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-6">
                                <FormGroup>
                                <Label >Current BreastFeeding</Label>
                                <InputGroup> 
                                    <Input 
                                        type="select"
                                        name="current_breastfeeding"
                                        id="current_breastfeeding"
                                        onChange={handleMedicalHistory}  
                                    >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                    <option value="Uncertain">Uncertain</option>
                                    </Input>

                                </InputGroup>
                            
                                </FormGroup>
                        </div>
                    </>)}
                     <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Previous ARV exposure</Label>
                            <InputGroup> 
                                <Input 
                                    type="select"
                                    name="previous_arv_exposure"
                                    id="previous_arv_exposure"
                                    onChange={handleMedicalHistory}  
                                >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                <option value="Uncertain">Uncertain</option>
                                </Input>

                            </InputGroup>
                        
                            </FormGroup>
                     </div>
                     <div className="form-group mb-3 col-md-6"></div>
                     <div className="form-group mb-3 col-md-4">
                                    
                        <div className="form-check custom-checkbox ml-1 ">
                        
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="early_arv_but_not_transfer_in"
                            id="early_arv_but_not_transfer_in"
                            onChange={handleMedicalHistory} 
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Early ARV but not transfer in
                        </label>
                        </div>
                    </div>
                    {props.patientObj.sex==='Female' && (
                    <div className="form-group mb-3 col-md-4">
                                    
                        <div className="form-check custom-checkbox ml-1 ">
                        
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="pmtct_only"
                            id="pmtct_only"
                            onChange={handleMedicalHistory} 
                            />
                           <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            PMTCT only
                        </label> 
                        </div>
                    </div>
                    )}
                    <div className="form-group mb-3 col-md-4">
                                    
                        <div className="form-check custom-checkbox ml-1 ">
                       
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="as_never_receive_arvs"
                            id="as_never_receive_arvs"
                            onChange={handleMedicalHistory} 
                            />
                             <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            As never receive ARVs
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                            <Label >Name of the Facility</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="name_of_the_facility"
                                    id="name_of_the_facility"
                                    onChange={handleMedicalHistory} 
                                />

                            </InputGroup>
                        
                            </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                            <Label >Duration of care from</Label>
                            <InputGroup> 
                                <Input 
                                    type="Date"
                                    name="duration_of_care_from"
                                    id="duration_of_care_from"
                                    onChange={handleMedicalHistory} 
                                />

                            </InputGroup>
                        
                            </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                            <Label >To</Label>
                            <InputGroup> 
                                <Input 
                                    type="date"
                                    name="to"
                                    id="to"
                                    onChange={handleMedicalHistory} 
                                />

                            </InputGroup>
                        
                            </FormGroup>
                    </div>
                    <h3>Current Medications(Caregiver should be prob ) if yes </h3>
                    <hr/>
                    <div className="form-group mb-3 col-md-2">
                    <div className="form-check custom-checkbox ml-1 ">
                        
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="none"
                            id="none"
                            
                            onChange={handleCurrentMedicalHistory} 
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            None
                        </label>
                        </div>
                    </div>
                    {!hideOtherCurrentMedication && ( 
                    <>
                    <div className="form-group mb-3 col-md-2">
                    <div className="form-check custom-checkbox ml-1 ">
                       
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="ART"
                            id="ART"
                            onChange={handleCurrentMedicalHistory} 
                            />
                             <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            ART
                        </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">
                    <div className="form-check custom-checkbox ml-1 ">
                        
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="CTX"
                            id="CTX"
                            onChange={handleCurrentMedicalHistory} 
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            CTX
                        </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">
                    <div className="form-check custom-checkbox ml-1 ">
                        
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="ant_tb_drugs"
                            id="ant_tb_drugs"
                            onChange={handleCurrentMedicalHistory} 
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Anti-TB drugs
                        </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-4">
                            <FormGroup>
                            <Label >Others</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="others"
                                    id="others"
                                    onChange={handleCurrentMedicalHistory}  
                                />

                            </InputGroup>
                        
                            </FormGroup>
                    </div>
                    </>
                    )}
                   <h3>Patient has disclosed status to:</h3>
                   <hr/>
                   <div className="form-group mb-3 col-md-2">
                    <div className="form-check custom-checkbox ml-1 ">
                       
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="no_one"
                            id="no_one"
                            onChange={handleDisclosure}
                            />
                             <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            No one
                            </label>
                        </div>
                    </div>
                    {!hideOtherPatientDisclosure && ( 
                    <>
                    <div className="form-group mb-3 col-md-2">
                    <div className="form-check custom-checkbox ml-1 ">
                        
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="family_member"
                            id="family_member"
                            onChange={handleDisclosure}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Family member
                        </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">
                    <div className="form-check custom-checkbox ml-1 ">
                        
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="friend"
                            id="friend"
                            onChange={handleDisclosure}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Friend
                        </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">
                    <div className="form-check custom-checkbox ml-1 ">
                        
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="spouse"
                            id="spouse"
                            onChange={handleDisclosure}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Spouse
                        </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">
                    <div className="form-check custom-checkbox ml-1 ">
                        
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="spiritual_leader"
                            id="spiritual_leader"
                            onChange={handleDisclosure}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Spiritual leader
                        </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">
                            <FormGroup>
                            <Label >Others</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="others"
                                    id="others"
                                    onChange={handleDisclosure} 
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                    </>
                    )}
                    <hr/>
                    <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >HIV Status can be discussed with (Record reported person, if any):</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="HIV_status_can_be_discussed"
                                    id="HIV_status_can_be_discussed"
                                    onChange={handleDisclosure}
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6"></div>

                    <hr/>
                    <h3>Past or current ARV or other medication's side effect</h3>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="none"
                            id="none"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            None
                            </label>
                        </div>
                    </div>
                    {!hideOtherPastArv && (
                        <>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="vomit"
                            id="vomit"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Signif.nausea/vomit
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="diarrhea"
                            id="diarrhea"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Diarrhea
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="headache"
                            id="headache"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Headache
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="pain_in_abdomen"
                            id="pain_in_abdomen"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Pain in abdomen or muscle
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="jaundice"
                            id="jaundice"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Jaundice
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="insomnia"
                            id="insomnia"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Insomnia/bad dreams
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="dizzy"
                            id="dizzy"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Confussion/Dizzy
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="tingling"
                            id="tingling"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Tingling of extremities
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="rash"
                            id="rash"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Rash
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="pancreatities"
                            id="pancreatities"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Pancreatities
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="steven_johnson_syndrome"
                            id="steven_johnson_syndrome"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Steven Johnson Syndrome
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="itching"
                            id="itching"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Itching
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="anemia"
                            id="anemia"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Anemia
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="weekness"
                            id="weekness"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Weekness/Fatigue
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="loss"
                            id="loss"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Fat accumulation or loss
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="hyperglycemia"
                            id="hyperglycemia"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Hyperglycemia
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="kidney_problem"
                            id="kidney_problem"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Kidney Problem
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                            
                            name="liver_problem"
                            id="liver_problem"
                            onChange={handlePastArv}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Liver Problem
                            </label>
                        </div>
                    </div>

                    <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Others(Specify)</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="others"
                                    id="others"
                                    onChange={handlePastArv} 
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-12">
                            <FormGroup>
                            <Label >If yes to past or current ARV or other medication's side effect, specify medication(s) </Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="if_yes_past_current_arv"
                                    id="if_yes_past_current_arv"
                                    onChange={handlePastArv}
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                    </>
                    )}
                    <hr/>
                    <h4>Physical exam</h4>
                    <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label ></Label>
                           
                            <span >(note: NSF = no significant findings)</span>                                       
                            </FormGroup>

                    </div>
                    <div className="form-group mb-3 col-md-6"></div>
                    <div className="row">
                    <div className=" mb-3 col-md-4">
                        <FormGroup>
                        <Label >Pulse</Label>
                        <InputGroup> 
                            <Input 
                                type="number"
                                name="pulse"
                                id="pulse"
                                onChange={handlePastArv}
                                min="40"
                                max="120"
                                value={vital.pulse}
                                onKeyUp={handleInputValueCheckPulse} 
                                style={{border: "1px solid #014D88", borderRadius:"0rem"}}
                            />
                            <InputGroupText addonType="append" style={{ backgroundColor:"#014D88", color:"#fff", border: "1px solid #014D88", borderRadius:"0rem"}}>
                                bmp
                            </InputGroupText>
                        </InputGroup>
                        {vitalClinicalSupport.pulse !=="" ? (
                                <span className={classes.error}>{vitalClinicalSupport.pulse}</span>
                        ) : ""}
                        {errors.pulse !=="" ? (
                            <span className={classes.error}>{errors.pulse}</span>
                        ) : "" }
                        </FormGroup>
                    </div>
                    <div className=" mb-3 col-md-4">
                        <FormGroup>
                        <Label >Respiratory Rate </Label>
                        <InputGroup> 
                            <Input 
                                type="number"
                                name="respiratoryRate"
                                id="respiratoryRate"
                                onChange={handlePastArv}
                                min="10"
                                max="70"
                                value={vital.respiratoryRate}
                                onKeyUp={handleInputValueCheckRespiratoryRate} 
                                style={{border: "1px solid #014D88", borderRadius:"0rem"}}
                            />
                            <InputGroupText addonType="append" style={{ backgroundColor:"#014D88", color:"#fff", border: "1px solid #014D88", borderRadius:"0rem"}}>
                                bmp
                            </InputGroupText>
                        </InputGroup>
                        {vitalClinicalSupport.respiratoryRate !=="" ? (
                                <span className={classes.error}>{vitalClinicalSupport.respiratoryRate}</span>
                        ) : ""}
                        {errors.respiratoryRate !=="" ? (
                            <span className={classes.error}>{errors.respiratoryRate}</span>
                        ) : "" }
                        </FormGroup>
                    </div>
                    <div className=" mb-3 col-md-4">
                        <FormGroup>
                        <Label >Temperature </Label>
                        <InputGroup> 
                            <Input 
                                type="number"
                                name="temperature"
                                id="temperature"
                                onChange={handlePastArv}
                                min="35"
                                max="47"
                                value={vital.temperature}
                                onKeyUp={handleInputValueCheckTemperature} 
                                style={{border: "1px solid #014D88", borderRadius:"0rem"}}
                            />
                            <InputGroupText addonType="append" style={{ backgroundColor:"#014D88", color:"#fff", border: "1px solid #014D88", borderRadius:"0rem"}}>
                                <sup>o</sup>c
                            </InputGroupText>
                        </InputGroup>
                        {vitalClinicalSupport.temperature !=="" ? (
                                <span className={classes.error}>{vitalClinicalSupport.temperature}</span>
                        ) : ""}
                        {errors.temperature !=="" ? (
                            <span className={classes.error}>{errors.temperature}</span>
                        ) : "" }
                        </FormGroup>
                    </div>
                   
                    <div className=" mb-3 col-md-4">
                        <FormGroup>
                        <Label >Body Weight</Label>
                        <InputGroup> 
                            <Input 
                                type="number"
                                name="bodyWeight"
                                id="bodyWeight"
                                onChange={handlePastArv}
                                min="3"
                                max="150"
                                value={vital.bodyWeight}
                                onKeyUp={handleInputValueCheckBodyWeight} 
                                style={{border: "1px solid #014D88", borderRadius:"0rem"}}
                            />
                            <InputGroupText addonType="append" style={{ backgroundColor:"#014D88", color:"#fff", border: "1px solid #014D88", borderRadius:"0rem"}}>
                                kg
                            </InputGroupText>
                        </InputGroup>
                        {vitalClinicalSupport.bodyWeight !=="" ? (
                                <span className={classes.error}>{vitalClinicalSupport.bodyWeight}</span>
                        ) : ""}
                        {errors.bodyWeight !=="" ? (
                            <span className={classes.error}>{errors.bodyWeight}</span>
                        ) : "" }
                        </FormGroup>
                    </div>                                   
                    <div className="form-group mb-3 col-md-4">
                        <FormGroup>
                        <Label >Height</Label>
                        <InputGroup> 
                        <InputGroupText
                                addonType="append"
                                
                                style={{ backgroundColor:"#014D88", color:"#fff", border: "1px solid #014D88", borderRadius:"0rem"}}
                                >
                                cm
                        </InputGroupText>
                            <Input 
                                type="number"
                                name="height"
                                id="height"
                                onChange={handlePastArv}
                                value={vital.height}
                                min="48.26"
                                max="216.408"
                                onKeyUp={handleInputValueCheckHeight} 
                                style={{border: "1px solid #014D88", borderRadius:"0rem"}}
                            />
                                <InputGroupText
                                
                                toggle={toggleDropDown}
                                style={{ backgroundColor:"#992E62", color:"#fff", border: "1px solid #992E62", borderRadius:"0rem"}}
                                >
                                {vital.height!=='' ? (vital.height/100).toFixed(2) + "m" : "m"}
                            </InputGroupText>
                        </InputGroup>
                        {vitalClinicalSupport.height !=="" ? (
                            <span className={classes.error}>{vitalClinicalSupport.height}</span>
                        ) : ""}
                        {errors.height !=="" ? (
                            <span className={classes.error}>{errors.height}</span>
                        ) : "" }
                        </FormGroup>
                    </div>
                    <div className="form-group mb-3 mt-2 col-md-4">
                        {vital.bodyWeight!=="" && vital.height!==''&&(
                            <FormGroup>
                            <Label > {" "}</Label>
                            <InputGroup> 
                            <InputGroupText addonType="append" style={{ backgroundColor:"#014D88", color:"#fff", border: "1px solid #014D88", borderRadius:"0rem"}}>
                                BMI : {Math.round(vital.bodyWeight/((vital.height * vital.height)/100))}
                            </InputGroupText>                   
                           
                            </InputGroup>                
                            </FormGroup>
                        )}
                    </div>
                    </div>
                    <div className="row">
                    <div className="form-group mb-3 col-md-8">
                        <FormGroup>
                        <Label >Blood Pressure</Label>
                        <InputGroup>
                        <InputGroupText addonType="append" style={{ backgroundColor:"#014D88", color:"#fff", border: "1px solid #014D88", borderRadius:"0rem"}}>
                                systolic(mmHg)
                        </InputGroupText> 
                            <Input 
                                type="number"
                                name="systolic"
                                id="systolic"
                                min="90"
                                max="2240"
                                onChange={handlePastArv}
                                value={vital.systolic}
                                onKeyUp={handleInputValueCheckSystolic}
                                style={{border: "1px solid #014D88", borderRadius:"0rem"}} 
                            />
                            <InputGroupText addonType="append" style={{ backgroundColor:"#014D88", color:"#fff", border: "1px solid #014D88", borderRadius:"0rem"}}>
                            diastolic(mmHg)
                            </InputGroupText>
                                <Input 
                                type="number"
                                name="diastolic"
                                id="diastolic"
                                min={0}
                                max={140}
                                onChange={handlePastArv}
                                value={vital.diastolic}
                                onKeyUp={handleInputValueCheckDiastolic} 
                                style={{border: "1px solid #014D88", borderRadius:"0rem"}}
                                />
                            
                            
                        </InputGroup>
                        {vitalClinicalSupport.systolic !=="" ? (
                        <span className={classes.error}>{vitalClinicalSupport.systolic}</span>
                        ) : ""}
                        {errors.systolic !=="" ? (
                            <span className={classes.error}>{errors.systolic}</span>
                        ) : "" }  
                        {vitalClinicalSupport.diastolic !=="" ? (
                        <span className={classes.error}>{vitalClinicalSupport.diastolic}</span>
                        ) : ""}
                        {errors.diastolic !=="" ? (
                            <span className={classes.error}>{errors.diastolic}</span>
                        ) : "" }          
                        </FormGroup>
                    </div>

                    </div>
                    <div className="row">                    
                    <div className="form-group mb-3 col-md-3">
                    <h3>General Appearance</h3>
                        <div className="form-group mb-3 col-md-12">                                    
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                           
                                name="nsf"
                                id="nsf"
                                onChange={handleGeneralApperance}
                                />
                                <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                NSF
                                </label>
                            </div>
                        </div>
                        {!hideGeneralApperance && (
                            <>
                        <div className="form-group mb-3 col-md-12">                                    
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                           
                                name="pallor"
                                id="pallor"
                                onChange={handleGeneralApperance}
                                />
                                <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Pallor
                                </label>
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-12">                                    
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                           
                                name="febrile"
                                id="febrile"
                                onChange={handleGeneralApperance}
                                />
                                <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Febrile
                                </label>
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-12">                                    
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                           
                                name="dehydrated"
                                id="dehydrated"
                                onChange={handleGeneralApperance}
                                />
                                <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Dehydrated
                                </label>
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-12">                                    
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                           
                                name="peripheral"
                                id="peripheral"
                                onChange={handleGeneralApperance}
                                />
                                <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Peripheral edema
                                </label>
                            </div>
                        </div>

                        <div className="form-group mb-3 col-md-12">
                                <FormGroup>
                                <Label >Other (specify)</Label>
                                <InputGroup> 
                                    <Input 
                                        type="text"
                                        name="other"
                                        id="other"
                                        onChange={handleGeneralApperance} 
                                    />
                                </InputGroup>                                        
                                </FormGroup>
                        </div>
                        </>
                        )}
                    </div>
                    
                    <div className="form-group mb-3 col-md-3">
                        <h3>Skin</h3>

                        <div className="form-group mb-3 col-md-12">                                    
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                           
                                name="nsf"
                                id="nsf"
                                onChange={handleSkin}
                                />
                                <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                NSF
                                </label>
                            </div>
                        </div>
                        {!hideSkin && (
                        <>
                        <div className="form-group mb-3 col-md-12">                                    
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                           
                                name="pruritic"
                                id="pruritic"
                                onChange={handleSkin}
                                />
                                <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Pruritic paplar dermatitis
                                </label>
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-12">                                    
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                           
                                name="abscesses"
                                id="abscesses"
                                onChange={handleSkin}
                                />
                                <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Abscesses
                                </label>
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-12">                                    
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                           
                                name="herpes"
                                id="herpes"
                                onChange={handleSkin}
                                />
                                <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Herpes zoster
                                </label>
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-12">                                    
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                           
                                name="kaposi"
                                id="kaposi"
                                onChange={handleSkin}
                                />
                                <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Kaposi's lesions
                                </label>
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-12">                                    
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                           
                                name="suborrheic"
                                id="suborrheic"
                                onChange={handleSkin}
                                />
                                <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Suborrheic dermatitis
                                </label>
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-12">                                    
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                           
                                name="fungal"
                                id="fungal"
                                onChange={handleSkin}
                                />
                                <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Fungal infections
                                </label>
                            </div>
                        </div>

                        <div className="form-group mb-3 col-md-12">
                                <FormGroup>
                                <Label >Other (specify)</Label>
                                <InputGroup> 
                                    <Input 
                                        type="text"
                                        name="other"
                                        id="other"
                                        onChange={handleSkin}
                                    />
                                </InputGroup>                                        
                                </FormGroup>
                        </div>
                        
                        </>
                        )}
                    </div>
                    <div className="form-group mb-3 col-md-3">
                        <h3>Head/Eye/ENT</h3>
                        <div className="form-group mb-3 col-md-12">                                    
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                           
                                name="nsf"
                                id="nsf"
                                onChange={handleEye}
                                />
                                <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                NSF
                                </label>
                            </div>
                        </div>
                        {!hideEye && (
                            <>
                        <div className="form-group mb-3 col-md-12">                                    
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                           
                                name="icterus"
                                id="icterus"
                                onChange={handleEye}
                                />
                                <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Icterus
                                </label>
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-12">                                    
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                           
                                name="thrush"
                                id="thrush"
                                onChange={handleEye}
                                />
                                <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Thrush
                                </label>
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-12">                                    
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                           
                                name="oral"
                                id="oral"
                                onChange={handleEye}
                                />
                                <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Oral KS
                                </label>
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-12">                                    
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                           
                                name="abnormal"
                                id="abnormal"
                                onChange={handleEye}
                                />
                                <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Abnormal fundoscopy
                                </label>
                            </div>
                        </div>

                        <div className="form-group mb-3 col-md-12">
                                <FormGroup>
                                <Label >Other (specify)</Label>
                                <InputGroup> 
                                    <Input 
                                        type="text"
                                        name="other"
                                        id="other"
                                        onChange={handleEye}
                                        
                                    />
                                </InputGroup>                                        
                                </FormGroup>
                        </div>

                        </>
                        )}
                    </div>
                    <div className="form-group mb-3 col-md-3">
                        <h3>Breasts</h3>
                        <div className="form-group mb-3 col-md-12">                                    
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                           
                                name="nsf"
                                id="nsf"
                                onChange={handleBreast}
                                />
                                <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                NSF
                                </label>
                            </div>
                        </div>
                        {!hideBreast && (
                            <>
                        <div className="form-group mb-3 col-md-12">                                    
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                           
                                name="lumps"
                                id="lumps"
                                onChange={handleBreast}
                                />
                                <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Lumps, masses
                                </label>
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-12">                                    
                            <div className="form-check custom-checkbox ml-1 ">
                                <input
                                type="checkbox"
                                className="form-check-input"                           
                                name="discharge"
                                id="discharge"
                                onChange={handleBreast}
                                />
                                <label
                                className="form-check-label"
                                htmlFor="basic_checkbox_1"
                                >
                                Discharge
                                </label>
                            </div>
                        </div>
                        <div className="form-group mb-3 col-md-12">
                                <FormGroup>
                                <Label >Other (specify)</Label>
                                <InputGroup> 
                                    <Input 
                                        type="text"
                                        name="other"
                                        id="other"
                                        onChange={handleBreast} 
                                    />
                                </InputGroup>                                        
                                </FormGroup>
                        </div>
                        </>
                        )}
                    </div>
                    <div className="form-group mb-3 col-md-3">
                    <h3>Cardiovascular</h3>
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="nsf"
                            id="nsf"
                            onChange={handleCardiovascular}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            NSF
                            </label>
                        </div>
                    </div>
                    {!hideCardiovascular && (
                    <>
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="abnormal_heart_rate"
                            id="abnormal_heart_rate"
                            onChange={handleCardiovascular}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Abnormal heart rate
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-12">
                            <FormGroup>
                            <Label >Other (specify)</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="other"
                                    id="other"
                                    onChange={handleCardiovascular}
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                    </>
                    )}
                    </div>
                    <div className="form-group mb-3 col-md-3">
                    <h3>Genitalia</h3>
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="nsf"
                            id="nsf"
                            onChange={handleGenitalia}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            NSF
                            </label>
                        </div>
                    </div>
                    {!hideGenitalia && (
                    <>
                   
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="genital_discharge"
                            id="genital_discharge"
                            onChange={handleGenitalia}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Genital discharge
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="genital_ulcer"
                            id="genital_ulcer"
                            onChange={handleGenitalia}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Genital ulcer/other lesion
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="inguinal"
                            id="inguinal"
                            onChange={handleGenitalia}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Inguinal node enlargement
                            </label>
                        </div>
                    </div>                 
                    <div className="form-group mb-3 col-md-12">
                            <FormGroup>
                            <Label >Other (specify)</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="other"
                                    id="other"
                                    onChange={handleGenitalia}
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                    </>
                     )}
                    </div>
                    <div className="form-group mb-3 col-md-3">
                    <h3>Respiratory</h3>
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="nsf"
                            id="nsf"
                            onChange={handleRespiratory}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            NSF
                            </label>
                        </div>
                    </div>
                    {!hideRespiratory && (
                        <>
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Rate (breaths/min)
                            </label>
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="rate"
                            id="rate"
                            onChange={handleRespiratory}
                            placeholder='breaths/min'
                            />
                            
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="labored"
                            id="labored"
                            onChange={handleRespiratory}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Labored breathing
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="cyanosis"
                            id="cyanosis"
                            onChange={handleRespiratory}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Cyanosis
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="wheezing"
                            id="wheezing"
                            onChange={handleRespiratory}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Wheezing
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="intercostal"
                            id="intercostal"
                            onChange={handleRespiratory}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Intercostal (sub) recession
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="auscultation_finding"
                            id="auscultation_finding"
                            onChange={handleRespiratory}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Auscultation findings
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-12">
                            <FormGroup>
                            <Label >Other (specify)</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="other"
                                    id="other"
                                    onChange={handleRespiratory}
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                   
                    </>
                    )}
                    </div>
                    <div className="form-group mb-3 col-md-3">                 
                    <h3>Gastrointestinal</h3>                    
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="nsf"
                            id="nsf"
                            onChange={handleGastrointestinal}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            NSF
                            </label>
                        </div>
                    </div>
                    {!hideGastrointestinal && (
                        <>
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="distention"
                            id="distention"
                            onChange={handleGastrointestinal}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Distention
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="hepatomegaly"
                            id="hepatomegaly"
                            onChange={handleGastrointestinal}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Hepatomegaly
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="spenomegaly"
                            id="spenomegaly"
                            onChange={handleGastrointestinal}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Spenomegaly
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="tenderness"
                            id="tenderness"
                            onChange={handleGastrointestinal}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Tenderness
                            </label>
                        </div>
                    </div>

                    <div className="form-group mb-3 col-md-12">
                            <FormGroup>
                            <Label >Other (specify)</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="other"
                                    id="other"
                                    onChange={handleGastrointestinal}
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                    
                    </>
                    )}
                    </div>

                    <div className="form-group mb-3 col-md-3">                 
                    <h3>Neurological</h3>                    
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="nsf"
                            id="nsf"
                            onChange={handleNeurological}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            NSF
                            </label>
                        </div>
                    </div>
                    {!hideNeurological && (
                        <>
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="orientation"
                            id="orientation"
                            onChange={handleNeurological}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Orientation to TPP
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="speechSlurs"
                            id="speechSlurs"
                            onChange={handleNeurological}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Speech slurs
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="neckStiffness"
                            id="neckStiffness"
                            onChange={handleNeurological}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Neck stiffness
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="blindness"
                            id="blindness"
                            onChange={handleNeurological}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Blindness 1/2 eyes
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="paresis"
                            id="paresis"
                            onChange={handleNeurological}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Hemiplegia/paresis
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="numbness"
                            id="numbness"
                            onChange={handleNeurological}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Numbness of extremities
                            </label>
                        </div>
                    </div>   
                    <div className="form-group mb-3 col-md-12">
                            <FormGroup>
                            <Label >Other (specify)</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="other"
                                    id="other"
                                    onChange={handleNeurological}
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                    
                    </>
                    )}
                    </div>
                    <div className="form-group mb-3 col-md-3">                 
                    <h3>Mental Status</h3>                    
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="nsf"
                            id="nsf"
                            onChange={handleMentalStatus}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            NSF
                            </label>
                        </div>
                    </div>
                    {!handlementalstatus && (
                        <>
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="mentation"
                            id="mentation"
                            onChange={handleMentalStatus}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Slow mentation
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="memoryloss"
                            id="memoryloss"
                            onChange={handleMentalStatus}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Memory loss
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="moodSwings"
                            id="moodSwings"
                            onChange={handleMentalStatus}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Mood swings
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="depression"
                            id="depression"
                            onChange={handleMentalStatus}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Depression
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="anxiety"
                            id="anxiety"
                            onChange={handleMentalStatus}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Anxiety
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="ideation"
                            id="ideation"
                            onChange={handleMentalStatus}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Suicidal ideation
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-12">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="tenderness"
                            id="tenderness"
                            onChange={handleMentalStatus}
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Tenderness
                            </label>
                        </div>
                    </div>

                    <div className="form-group mb-3 col-md-12">
                            <FormGroup>
                            <Label >Other (specify)</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="other"
                                    id="other"
                                    onChange={handleMentalStatus}
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                    
                    </>
                    )}
                    </div>
                    </div>
        
                    <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Additional and detailed findings</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="additional_finiding"
                                    id="additional_finiding"
                                    onChange={handleGastrointestinal}
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6"></div>
                    <hr/>
                    <h3>Assessment</h3>
                    <div className="form-group mb-3 col-md-6">                                    
                        <FormGroup>
                        <InputGroup> 
                                <Input 
                                    type="select"
                                    name="previous_arv_exposure"
                                    id="previous_arv_exposure"
                                    onChange={handleMedicalHistory}  
                                >
                                <option value="">Select</option>
                                <option value="Asymptomatic">Asymptomatic</option>
                                <option value="Symptomatic">Symptomatic</option>
                                <option value="AIDS defining illness">AIDS defining illness</option>

                                
                                </Input>

                            </InputGroup>
                        </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6"> </div>
                    <hr/>
                    <h3>WHO staging criteria (History of any of the following)</h3>
                    <div className="form-group mb-3 col-md-6">                                    
                        <FormGroup>
                        <Label >WHO STAGE</Label>
                        <InputGroup> 
                                <Input 
                                    type="select"
                                    name="stage"
                                    id="stage"
                                    onChange={handleWho}  
                                >
                                <option value="">Select</option>
                                <option value="stage 1">Stage 1</option>
                                <option value="stage 2">Stage 2</option>
                                <option value="stage 3">Stage 3</option>
                                <option value="stage 4">Stage 4</option>
                                
                                </Input>

                            </InputGroup>
                        </FormGroup>
                    </div>
                    {hideStage1 && (
                    <div className="form-group mb-3 col-md-6">                                    
                        <FormGroup>
                        <Label >Stage 1 options</Label>
                        <InputGroup> 
                                <Input 
                                    type="select"
                                    name="value"
                                    id="value"
                                    onChange={handleWho}  
                                >
                                <option value="">Select</option>
                                <option value="Asymptomatic">Asymptomatic</option>
                                <option value="Persistent generalized lymphadenopathy">Persistent generalized lymphadenopathy</option>
                                <option value="Performance scale: 1 asymptomatic, normal activity">Performance scale: 1 asymptomatic, normal activity</option>
                                
                                </Input>

                            </InputGroup>
                        </FormGroup>
                    </div>
                    )}
                    {hideStage2 && (
                    <div className="form-group mb-3 col-md-6">                                    
                        <FormGroup>
                        <Label >Stage 2 options</Label>
                        <InputGroup> 
                                <Input 
                                    type="select"
                                    name="value"
                                    id="value"
                                    onChange={handleWho}  
                                >
                                <option value="">Select</option>
                                <option value="Weight loss less than 10% of body weight">Weight loss {"<"}10% of body weight</option>
                                <option value="Minor Mucocutaneous Manifestations">Minor Mucocutaneous Manifestations</option>
                                <option value="Herpes Zoster (within last 5 years)">Herpes Zoster (within last 5 years)</option>
                                <option value=" Recurrent Upper Respiratory Tract Infections"> Recurrent Upper Respiratory Tract Infections</option>
                                <option value="Performance scale: 2 symptomatic, normal activity">Performance scale: 2 symptomatic, normal activity</option>
                                </Input>

                            </InputGroup>
                        </FormGroup>
                    </div>
                    )}
                    {hideStage3 && (
                    <>
                    <div className="form-group mb-3 col-md-6">                                    
                        <FormGroup>
                        <Label >Stage 3 options</Label>
                        <InputGroup> 
                                <Input 
                                    type="select"
                                    name="value"
                                    id="value"
                                    onChange={handleWho} 
                                >
                                <option value="">Select</option>
                                <option value="Weight loss greater than 10% of body weight">Weight loss {">"}10% of body weight</option>
                                <option value="Unexplained Chronic Diarrhea less than 1 month">Unexplained Chronic Diarrhea ({">"}1 month)</option>
                                <option value="Unexplained Prolonged Fever">Unexplained Prolonged Fever</option>
                                <option value="Oral Candidiasis">Oral Candidiasis</option>
                                <option value="Oral Hairy Leukoplakia">Oral Hairy Leukoplakia</option>
                                <option value="TB, Pulmonary (within previous year)">TB, Pulmonary (within previous year)</option>
                                <option value="Severe Bacterial Infections">Severe Bacterial Infections</option>
                                <option value="Performance scale: 3 bedridden  less than 50% of day in last month">Performance scale: 3 bedridden {"<"}50% of day in last month</option>
                                </Input>

                            </InputGroup>
                        </FormGroup>
                    </div>
                    </>
                    )}
                    {hideStage4 && (
                    <div className="form-group mb-3 col-md-6">                                    
                        <FormGroup>
                        <Label >Stage 4 options</Label>
                        <InputGroup> 
                                <Input 
                                    type="select"
                                    name="value"
                                    id="value"
                                    onChange={handleWho}  
                                >
                                <option value="">Select</option>
                                <option value="HIV Wasting syndrome">HIV Wasting syndrome</option>
                                <option value="PCP">PCP</option>
                                <option value="Toxoplasmosis, CNS">Toxoplasmosis, CNS</option>
                                <option value="Cryptosporidiosis with Diarrhea greater than 1 month">Cryptosporidiosis with Diarrhea ({">"}1 month)</option>
                                <option value="Cryptococcosis, Extrapulmonary">Cryptococcosis, Extrapulmonary</option>
                                <option value="Cytomegalovirus disease">Cytomegalovirus disease</option>
                                <option value="Herpes Simplex (mucotaneous greater than 1 month)">Herpes Simplex (mucotaneous {">"}1 month)</option>
                                <option value="Progressive Multifocal Leukoencephalopathy">Progressive Multifocal Leukoencephalopathy</option>
                                <option value="Mycosis, disseminated"> Mycosis, disseminated</option>
                                <option value="Oesophageal Candidiasis">Oesophageal Candidiasis</option>
                                <option value="Atypical Mycobacteriosis, disseminated">Atypical Mycobacteriosis, disseminated</option>
                                <option value="Salmonella Septicemia, Non-typhoid">Salmonella Septicemia, Non-typhoid</option>
                                <option value="TB, Extrapulmonary"> TB, Extrapulmonary</option>
                                <option value="Lymphoma">Lymphoma</option>
                                <option value="Kaposi's Sarcoma"> Kaposi's Sarcoma</option>
                                <option value="HIV encephalopathy">  HIV encephalopathy</option>
                                <option value="Performance scale: 4 bedridden greater than 50% of the day in last month"> Performance scale: 4 bedridden {">"}50% of the day in last month</option>
                                </Input>

                            </InputGroup>
                        </FormGroup>
                    </div>
                   )}
                  
                    <hr/>
                    <h3> Plan (specify orders on requisition)</h3>
                    <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Lab evaluation</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="lab_evaluation"
                                    id="lab_evaluation"
                                    onChange={handlePlan} 
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                    <div className="form-group  col-md-5">
                                <FormGroup>
                                    <Label>CD4 Count </Label>
                                    <select
                                        className="form-control"
                                        name="cd4Count"
                                        id="cd4Count"
                                        //value={cd4Count.cd4Count}
                                        onChange={handlePlan}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="Semi-Quantitative">Semi-Quantitative</option>
                                        <option value="Flow Cyteometry">Flow Cyteometry</option>
                                        
                                    </select>
                                    
                                </FormGroup>
                            </div>
                            {hidecd4CountQuantitative ==='Semi-Quantitative' && (
                            <div className="form-group  col-md-5">
                                <FormGroup>
                                    <Label>CD4 Count Value</Label>
                                    <select
                                        className="form-control"
                                        name="cd4SemiQuantitative"
                                        id="cd4SemiQuantitative"
                                        //value={cd4Count.cd4SemiQuantitative}
                                        onChange={handlePlan}
                                        style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
                                    >
                                        <option value={""}></option>
                                        <option value="Semi-Quantitative">{"<200"}</option>
                                        <option value="Flow Cyteometry">{">=200"}</option>
                                        
                                    </select>
                                    
                                </FormGroup>
                            </div>
                            )}
                            {hidecd4CountFlow ==='Flow Cyteometry' && (
                            <div className="form-group mb-3 col-md-4">
                                <FormGroup>
                                <Label for="">CD4 Count Value</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    name="cd4FlowCyteometry"
                                    id="cd4FlowCyteometry"
                                    //value={cd4Count.cd4FlowCyteometry}
                                    onChange={handlePlan}
                                    style={{border: "1px solid #014D88", borderRadius:"0.25rem"}}
                                    
                                />
                                 
                                </FormGroup>
                            </div>
                            )}
                    <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >CD4 count evaluation</Label>                       
                            <InputGroup> 
                                <Input 
                                    type="select"
                                    name="previous_arv_exposure"
                                    id="previous_arv_exposure"
                                    onChange={handleMedicalHistory}  
                                >
                                <option value="">Select</option>
                                <option value="CD4 LFA">CD4 LFA</option>
                                <option value="less than 200">{"<"}200</option>
                                <option value="greater than and equal to 200">  ???200</option>
                               
                                </Input>

                            </InputGroup>                                      
                            </FormGroup>
                    </div>
                    <hr/>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="tb_investigation"
                            id="tb_investigation"
                            onChange={handlePlan} 
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            TB Investigations
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="expert"
                            id="expert"
                            onChange={handlePlan} 
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            Xpert MTB/RIF
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="cxr"
                            id="cxr"
                            onChange={handlePlan} 
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            CXR
                            </label>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-2">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <input
                            type="checkbox"
                            className="form-check-input"                           
                            name="lf_lam"
                            id="lf_lam"
                            onChange={handlePlan} 
                            />
                            <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                            >
                            LF_LAM
                            </label>
                        </div>
                    </div>
                   
                    <hr/>
                    <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >OI Prophylaxis</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="oi_prophylaxis"
                                    id="oi_prophylaxis"
                                    onChange={handlePlan} 
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >OI therapy </Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="oi_therapy"
                                    id="oi_therapy" 
                                    onChange={handlePlan} 
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Adherence counseling</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="adherence"
                                    id="adherence"
                                    onChange={handlePlan} 
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Admission</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="admission"
                                    id="admission"
                                    onChange={handlePlan} 
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Cervical cancer screening</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="cervical"
                                    id="cervical" 
                                    onChange={handlePlan} 
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Symptomatic treatment/pain control (specify)</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="symptomatic"
                                    id="symptomatic" 
                                    onChange={handlePlan} 
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Cryptococcal antigen test</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="cryptococcal"
                                    id="cryptococcal"
                                    onChange={handlePlan} 
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Other referrals (specify)</Label>
                            <InputGroup> 
                                <Input 
                                    type="text"
                                    name="other_referrals"
                                    id="other_referrals" 
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>
                    <hr/>
                    <h3>Enroll in</h3>
                    <div className="form-group mb-3 col-md-5">                                    
                        <div className="form-check custom-checkbox ml-1 ">
                            <Input 
                                type="select"
                                name="enrollIn"
                                id="enrollIn"
                                onChange={handleEnroll}  
                            >
                            <option value="">Select</option>
                            <option value="General medical follow-up">General medical follow-up</option>
                            <option value="ARV therapy">ARV therapy</option>
                            <option value="AHD management">AHD management</option>
                            <option value="Pending lab results">Pending lab results</option>
                            </Input>
                        </div>
                    </div>
                    <div className="form-group mb-3 col-md-7">  </div>
                    <hr/>
                    <h3>Plan for Antiretroviral Therapy (ART)</h3>
                    <div className="form-group mb-3 col-md-6">                                    
                        <FormGroup>
                            <Label>Ongoing Monitoring </Label>
                            <Input 
                                    type="select"
                                    name="previous_arv_exposure"
                                    id="previous_arv_exposure"
                                    onChange={handlePlanArt}  
                                >
                                <option value="">Select</option>
                                <option value="Restart treatment">Restart treatment</option>
                                <option value="Start new treatment">Start new treatment</option>
                                <option value="Stop treatment">Stop treatment </option>
                                <option value="Change treatment">Change treatment </option>
                                <option value="ARV TX postponed for clinical reason">ARV TX postponed for clinical reason</option>
                                </Input>
                        </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6"> </div>
                    
                    <hr/>
                    <h3>Regimen</h3>
                    <div className="form-group mb-3 col-md-6">                                    
                        <FormGroup>
                            <Label>Regimen Line</Label>
                            <Input 
                                    type="select"
                                    name="regimenLine"
                                    id="regimenLine"
                                    onChange={handleRegimen}  
                                >
                                <option value="">Select</option>
                                <option value="first line">First Line</option>
                                <option value="second line">Second Line</option>
                                <option value="third line">Third Line </option>
                               
                                </Input>
                        </FormGroup>
                    </div>
                    {hideFirstLine && (
                    <div className="form-group mb-3 col-md-6">                                    
                        <FormGroup>
                            <Label>First Line Regimen</Label>
                            <Input 
                                    type="select"
                                    name="regimen"
                                    id="regimen"
                                    onChange={handleRegimen}  
                                >
                                <option value="">Select</option>
                                <option value="TDF + 3TC + DTG">TDF + 3TC + DTG</option>
                                <option value="TDF + FTC + DTG">TDF + FTC + DTG</option>
                                <option value="TDF + 3TC + EFV400">TDF + 3TC + EFV400</option>
                                <option value="TAF + 3TC + DTG">TAF + 3TC + DTG</option> 
                                <option value="ABC + 3TC + DTG">ABC + 3TC + DTG</option> 
                                <option value="AZT + 3TC + EFV400">AZT + 3TC + EFV400</option>                              
                            </Input>
                        </FormGroup>
                    </div>
                    )}
                    {hideSecondLine && (
                    <div className="form-group mb-3 col-md-6">                                    
                        <FormGroup>
                            <Label>Second Line Regimen</Label>
                            <Input 
                                    type="select"
                                    name="regimen"
                                    id="regimen"
                                    onChange={handleRegimen}  
                                >
                                <option value="">Select</option>
                                <option value="AZT + 3TC + ATV/r">AZT + 3TC + ATV/r</option>
                                <option value="AZT + 3TC + LPV/r">AZT + 3TC + LPV/r</option>
                                <option value="AZT + FTC + ATV/r">AZT + FTC + ATV/r</option>
                                <option value="AZT + FTC + LPV/r">AZT + FTC + LPV/r</option>  
                                <option value="TDF + 3TC + ATV/r">TDF + 3TC + ATV/r </option>
                                <option value="TDF + 3TC + LPV/r">TDF + 3TC + LPV/r </option>
                                <option value="TDF +  FTC + ATV/r">TDF +  FTC + ATV/r</option>  
                                <option value="TDF + FTC + LPV/r">TDF + FTC + LPV/r</option>
                                <option value="AZT + 3TC + DRV/r">AZT + 3TC + DRV/r</option>   
                                <option value="AZT + FTC + DRV/r">AZT + FTC + DRV/r</option>                       
                                <option value="AZT + 3TC + DTG">AZT + 3TC + DTG</option>
                                <option value="AZT +  FTC + DTG">AZT +  FTC + DTG</option>
                                <option value="TDF + 3TC + DTG">TDF + 3TC + DTG</option>
                                <option value="TDF +  FTC + DTG">TDF +  FTC + DTG</option>
                            </Input>
                        </FormGroup>
                    </div>
                    )}
                    {hideThirdLine && (
                    <div className="form-group mb-3 col-md-6">                                    
                        <FormGroup>
                            <Label>Third Line Regimen</Label>
                            <Input 
                                    type="select"
                                    name="regimen"
                                    id="regimen"
                                    onChange={handleRegimen}  
                                >
                                <option value="">Select</option>
                                <option value="TDF + 3TC + DRV/r + DTG">TDF + 3TC + DRV/r + DTG</option>
                                <option value="TDF + 3TC + DRV/r + DTG + ETV">TDF + 3TC + DRV/r + DTG + ETV</option>
                                <option value="TDF + FTC + DRV/r + DTG">TDF + FTC + DRV/r + DTG</option>
                                <option value="TDF + FTC + DRV/r + DTG + ETV">TDF + FTC + DRV/r + DTG + ETV</option>  
                                <option value="AZT + 3TC + DRV/r + ETV + DTG">AZT + 3TC + DRV/r + ETV + DTG</option>
                                <option value="AZT + FTC + DRV/r + ETV + DTG">AZT + FTC + DRV/r + ETV + DTG </option>
                                <option value="AZT + 3TC + DRV/r + ETV">AZT + 3TC + DRV/r + ETV</option>  
                                <option value="AZT + FTC + DRV/r + ETV">AZT + FTC + DRV/r + ETV</option>
                                <option value="AZT + 3TC + DRV/r + DTG">AZT + 3TC + DRV/r + DTG</option>   
                                <option value="AZT + 3TC + DRV/r + DTG">AZT + FTC + DRV/r + DTG</option> 
                                <option value="AZT + 3TC + DRV/r + DTG">AZT + 3TC + DRV/r</option> 
                                <option value="AZT + FTC + DRV/r">AZT + FTC + DRV/r</option>                        
                            </Input>
                        </FormGroup>
                    </div>
                    )}
                    <br/>
                    <div className="form-group mb-3 col-md-6">
                            <FormGroup>
                            <Label >Next appointment</Label>
                            <InputGroup> 
                                <Input 
                                    type="date"
                                    name="next_appointment"
                                    id="next_appointment"
                                    onChange={handleInputChangeobjValues} 
                                />
                            </InputGroup>                                        
                            </FormGroup>
                    </div>   
                </div>
                
                {saving ? <Spinner /> : ""}
            <br />
            
            <MatButton
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
            >
                {!saving ? (
                <span style={{ textTransform: "capitalize" }}>Save</span>
                ) : (
                <span style={{ textTransform: "capitalize" }}>Saving...</span>
                )}
            </MatButton>
            
            <MatButton
                variant="contained"
                className={classes.button}
                startIcon={<CancelIcon />}
                
            >
                <span style={{ textTransform: "capitalize" }}>Cancel</span>
            </MatButton>
            
                </form>
            </CardBody>
        </Card> 
                  
    </div>
  );
}

export default ClinicEvaluationFrom;
