import {
  InputGroup,
  InputLeftElement,
  Input,
  IconButton,
} from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';

export default function SearchBox() {
  return (
    <InputGroup width={300}>
      <IconButton
        colorScheme="gray"
        aria-label="Search database"
        icon={<Search2Icon />}
      />
      <Input type="text" placeholder="Search..." />
    </InputGroup>
  );
}
