
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
  selectedValue,
}) {
  const [value, setValue] = React.useState("");

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setValue((event.target as HTMLInputElement).value);
  // };

  const handleChange = (value) => {
    setValue(value);
    selectedValue({field: "radio button value", value: value});
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
      </RadioGroup>
    </FormControl>
  );
}

{/* <FormControl>
<FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
<RadioGroup
  aria-labelledby="demo-radio-buttons-group-label"
  defaultValue="female"
  name="radio-buttons-group"
>
  <FormControlLabel value="female" control={<Radio />} label="Female" />
  <FormControlLabel value="male" control={<Radio />} label="Male" />
  <FormControlLabel value="other" control={<Radio />} label="Other" />
</RadioGroup>
</FormControl> */}

MaterialRadioButton.propTypes = {
  formTitle: PropTypes.string,
  buttonOne: PropTypes.shape({
    value: PropTypes.bool,
    label: PropTypes.string,
  }),
  buttonTwo: PropTypes.shape({
    value: PropTypes.bool,
    label: PropTypes.string,
  }),
  selectedValue: PropTypes.func,
}

MaterialRadioButton.defaultProps = {
  formTitle: "",
  buttonOne: {},
  buttonTwo: {},
  selectedValue: () => {},
}

export default MaterialRadioButton;
