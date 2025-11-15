// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TestContract {
    // Struct definition for tuple
    struct Person {
        string name;
        uint256 age;
        address wallet;
        bool isActive;
    }

    struct ComplexData {
        uint256 id;
        Person person;
        uint256[] scores;
    }

    // Storage for testing
    Person[] public people;
    uint256[] public numbers;
    address[] public addresses;
    ComplexData[] public complexDataList;

    // Test function: return array of uint256
    function getNumbers() public pure returns (uint256[] memory) {
        uint256[] memory result = new uint256[](3);
        result[0] = 100;
        result[1] = 200;
        result[2] = 300;
        return result;
    }

    // Test function: return array of addresses
    function getAddresses() public pure returns (address[] memory) {
        address[] memory result = new address[](2);
        result[0] = 0x1111111111111111111111111111111111111111;
        result[1] = 0x2222222222222222222222222222222222222222;
        return result;
    }

    // Test function: return tuple (struct)
    function getPerson() public pure returns (Person memory) {
        return Person({
            name: "Alice",
            age: 30,
            wallet: 0x1234567890123456789012345678901234567890,
            isActive: true
        });
    }

    // Test function: return array of tuples
    function getPeople() public pure returns (Person[] memory) {
        Person[] memory result = new Person[](2);
        result[0] = Person({
            name: "Alice",
            age: 30,
            wallet: 0x1234567890123456789012345678901234567890,
            isActive: true
        });
        result[1] = Person({
            name: "Bob",
            age: 25,
            wallet: 0x0987654321098765432109876543210987654321,
            isActive: false
        });
        return result;
    }

    // Test function: return nested tuple (ComplexData)
    function getComplexData() public pure returns (ComplexData memory) {
        uint256[] memory scores = new uint256[](3);
        scores[0] = 85;
        scores[1] = 90;
        scores[2] = 95;

        return ComplexData({
            id: 1,
            person: Person({
                name: "Charlie",
                age: 28,
                wallet: 0xABCDEFABCDEFABCDEFABCDEFABCDEFABCDEFAB,
                isActive: true
            }),
            scores: scores
        });
    }

    // Test function: return array of nested tuples
    function getComplexDataList() public pure returns (ComplexData[] memory) {
        ComplexData[] memory result = new ComplexData[](2);
        
        uint256[] memory scores1 = new uint256[](2);
        scores1[0] = 80;
        scores1[1] = 85;

        uint256[] memory scores2 = new uint256[](3);
        scores2[0] = 90;
        scores2[1] = 95;
        scores2[2] = 100;

        result[0] = ComplexData({
            id: 1,
            person: Person({
                name: "David",
                age: 32,
                wallet: 0x1111111111111111111111111111111111111111,
                isActive: true
            }),
            scores: scores1
        });

        result[1] = ComplexData({
            id: 2,
            person: Person({
                name: "Eve",
                age: 27,
                wallet: 0x2222222222222222222222222222222222222222,
                isActive: false
            }),
            scores: scores2
        });

        return result;
    }

    // Test functions with inputs: sum of uint256 array
    function sumArray(uint256[] memory numbers) public pure returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 0; i < numbers.length; i++) {
            sum += numbers[i];
        }
        return sum;
    }

    // Test function with input: tuple
    function processPerson(Person memory person) public pure returns (string memory) {
        if (person.isActive) {
            return string.concat("Active: ", person.name);
        } else {
            return string.concat("Inactive: ", person.name);
        }
    }

    // Test function with input: array of tuples
    function countActivePeople(Person[] memory people) public pure returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < people.length; i++) {
            if (people[i].isActive) {
                count++;
            }
        }
        return count;
    }

    // Test function with input: nested tuple
    function getTotalScore(ComplexData memory data) public pure returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < data.scores.length; i++) {
            total += data.scores[i];
        }
        return total;
    }

    // Test function with multiple inputs: array + tuple
    function addPersonToNumbers(
        uint256[] memory numbers,
        Person memory person
    ) public pure returns (uint256[] memory) {
        uint256[] memory result = new uint256[](numbers.length + 1);
        for (uint256 i = 0; i < numbers.length; i++) {
            result[i] = numbers[i];
        }
        result[numbers.length] = person.age;
        return result;
    }

    // Test function: return multiple values (tuple return)
    function getPersonAndNumbers() public pure returns (Person memory, uint256[] memory) {
        uint256[] memory nums = new uint256[](2);
        nums[0] = 42;
        nums[1] = 24;

        return (
            Person({
                name: "Frank",
                age: 35,
                wallet: 0x3333333333333333333333333333333333333333,
                isActive: true
            }),
            nums
        );
    }
}

