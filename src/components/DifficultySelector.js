// src/components/DifficultySelector.js
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';


const DifficultySelector = ({ onChange }) => {
  return (
    <Box sx={{ minWidth: 120, marginBottom: 2}}>
    <FormControl fullWidth>
      <InputLabel variant="standard" htmlFor="difficulty">
      Select Difficulty:
      </InputLabel>
      <NativeSelect
        defaultValue={'easy'}
        inputProps={{
          name: 'difficulty',
          id: 'difficulty',
        }}
        onChange={onChange}
      >
        <option style={{backgroundColor:'#9ea866'}} value={'easy'}>Easy</option>
        <option style={{backgroundColor:'#9ea866'}} value={'medium'}>Medium</option>
        <option style={{backgroundColor:'#9ea866'}} value={'hard'}>Hard</option>
      </NativeSelect>
    </FormControl>
  </Box>
  );
};

export default DifficultySelector;
