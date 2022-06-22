import React,{useState} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
import ButtonMui from "@material-ui/core/Button";
import 'semantic-ui-css/semantic.min.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PatientCardDetail from './PatientCard'
import { useHistory } from "react-router-dom";
import { Alert } from "react-bootstrap";
import SubMenu from './SubMenu';
import RecentHistory from './../History/RecentHistory';
import Consultation from './../Consultation/Home'
import Pharmacy from './../Pharmacy/Index'
import Laboratory from './../Laboratory/index'

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    alignItems: 'center',
  },
  column: {
    flexBasis: '20.33%',
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});


function PatientCard(props) {
    let history = useHistory();
    const [art, setArt] = useState(false);
    const [activeContent, setActiveContent] = useState('recent-history');
    const { classes } = props;
    const patientObj = history.location && history.location.state ? history.location.state.patientObj : {}
    console.log(activeContent)
  return (
    <div className={classes.root}>
      <Card >
        <CardContent>
            <PatientCardDetail patientObj={patientObj} setArt={setArt} />
            
            <SubMenu patientObj={patientObj} art={art} setActiveContent={setActiveContent}/>
            <Link to={"/"} >
            <ButtonMui
                variant="contained"
                color="primary"
                className=" float-end ms-2"
                //startIcon={<FaUserPlus size="10"/>}

            >
                <span style={{ textTransform: "capitalize" }}>Back</span>
            </ButtonMui>
          </Link>
          <br/><br/><br/>
          {activeContent==='recent-history' &&(<RecentHistory />)}
          {activeContent==='consultation' &&( <Consultation />)}
          {activeContent==='pharmacy' &&( <Pharmacy />)}
          {activeContent==='laboratory' &&( <Laboratory />)}
         </CardContent>
      </Card>
    </div>
  );
}

PatientCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PatientCard);
