import React, {useState} from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

interface Person {
    name: string;
    roles: [];
    unavailabilities: string[];
    wfhDays: [];
    leaveDays: [];
    weight: number
}

interface Props {
    existingArray: Person[];
    onArrayUpdate: (updatedArray: Person[]) => void;
    closeModal: () => void;
}

const BulkAdd: React.FC<Props> = ({existingArray, onArrayUpdate, closeModal}) => {
    const [newNames, setNewNames] = useState('');
    const [people, setPeople] = useState<Person[]>(existingArray);

    const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewNames(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newPeople = newNames.split('\n').map((name): Person => ({
            name: name.trim(), // Trim extra whitespace
            roles: [],
            unavailabilities: [],
            wfhDays: [],
            leaveDays: [],
            weight: 100,
        }));

        setPeople([...people, ...newPeople]);
        onArrayUpdate([...people, ...newPeople]);
        setNewNames(''); // Clear textbox
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Label for="newNamesTextarea">Enter Names (one per line):</Form.Label>
            <Form.Control
                as="textarea"
                id="newNamesTextarea"
                value={newNames}
                onChange={handleTextAreaChange}
                required
            />
            <br></br>
            <Button type="submit" onClick={closeModal} disabled={newNames.length < 3}>Import</Button>
        </Form>
    );
};

export default BulkAdd;
