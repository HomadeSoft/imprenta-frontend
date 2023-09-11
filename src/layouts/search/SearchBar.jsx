import {useEffect, useState} from "react";
import useDebounce from "../hooks/useDebounce";
import MDBox from "../../components/MDBox";
import MDInput from "../../components/MDInput";

const SearchBar = ({ getData, searchAttributes = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(
    () => {
      if (debouncedSearchTerm) {
        setIsSearching(true);
        getData(debouncedSearchTerm)
      } else {
        setIsSearching(false);
        getData()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedSearchTerm]
  );

  return (
    <MDBox ml="auto" mr="15px" display={"flex"} gap={2} alignItems={'center'}>
      <div style={{flex: 3, fontWeight: 200, fontSize: 16, textAlign: 'end'}}>
        {`Buscar por: ${searchAttributes}`}
      </div>
      <div style={{flex: 1}}>
        <MDInput
          placeholder="Buscar..."
          size="small"
          fullWidth
          onChange={({ currentTarget }) => {
            setSearchTerm(currentTarget.value)
          }}
        />
      </div>
    </MDBox>
  )
}

export default SearchBar