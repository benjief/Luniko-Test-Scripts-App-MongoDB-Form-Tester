import * as React from 'react';
import PropTypes from 'prop-types';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

/**
 * Two-to-three-radio-button component customized from the original Material UI component that can be found here: https://mui.com/material-ui/react-react-radio-button/.
 * @returns said radio button component.
 */
function MaterialRadioButton({
  formTitle, // text displayed above the radio buttons
  buttonOne, // object of the following form: {value: "string", label: "string"}
  buttonTwo, // object of the following form: {value: "string", label: "string"}
  buttonThree, // object of the following form: {value: "string", label: "string"}
  selectedValue, // callback function that provides selected value to the component containing this component
  defaultValue, // value to be selected by the component upon initial render
}) {
  const [value, setValue] = React.useState(defaultValue);

  /**
   * Sets the value of the component to the selected value and sends said selected value back to the component containing this component as an object.
   * @param {string} value - the selected value. 
   */
  const handleChange = (value) => {
    setValue(value);
    selectedValue({ field: "radio button value", value: value });
  }

  return (
    <FormControl>
      <FormLabel id="demo-controlled-radio-buttons-group">{formTitle}</FormLabel>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={(event, object) => handleChange(object)}
        sx={{
          '& .MuiSvgIcon-root': {
            fontSize: 27,
          },
        }}>
        <FormControlLabel value={buttonOne.value} control={<Radio />} label={buttonOne.label} />
        <FormControlLabel value={buttonTwo.value} control={<Radio />} label={buttonTwo.label} />
        {buttonThree
          ? <FormControlLabel value={buttonThree.value} control={<Radio />} label={buttonThree.label} />
          : <div></div>}
      </RadioGroup>
    </FormControl>
  );
}

MaterialRadioButton.propTypes = {
  formTitle: PropTypes.string,
  buttonOne: PropTypes.shape({
    value: PropTypes.string, // TODO: make button values more general (shouldn't necessarily be restricted to strings)
    label: PropTypes.string,
  }),
  buttonTwo: PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  }),
  buttonThree: PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  }),
  selectedValue: PropTypes.func,
  defaultValue: PropTypes.string,
}

MaterialRadioButton.defaultProps = {
  formTitle: "",
  buttonOne: null,
  buttonTwo: null,
  buttonThree: null, // TODO: test this (i.e. see if it causes a warning)
  selectedValue: () => { },
  defaultValue: "",
}

export default MaterialRadioButton;
