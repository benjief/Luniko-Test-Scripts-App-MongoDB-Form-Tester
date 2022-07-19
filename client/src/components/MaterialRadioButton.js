import * as React from 'react';
import PropTypes from 'prop-types';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

function MaterialRadioButton({
  formTitle,
  buttonOne,
  buttonTwo,
  buttonThree,
  selectedValue,
  defaultValue,
}) {
  const [value, setValue] = React.useState(defaultValue);

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
        }}
      >
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
    value: PropTypes.string,
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
