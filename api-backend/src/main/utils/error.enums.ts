export enum Errors {
  UNKNOWN_ENDPOINT = 'Unknown endpoint',

  INCORRECT_ID = 'Incorrect ID',
  WRONG_STRUCTURE = 'Wrong values were supplied',
  DUPLICATE_ENTRY = 'The entry is a duplicate or has a unique key violation',
  COMPANY_RELATIONSHIP = 'Supplied child copmany already has a parent',
  COMPANY_PARENTHOOD = 'Supplied parent and child companies have no relation',
  PARENT_NOT_EXIST = 'Parent company does not exist',
  CHILD_NOT_EXIST = 'Child company does not exist',
  COMPANY_NOT_EXIST = 'Company does not exist',
  STATION_TYPE_NOT_EXIST = 'Station type does not exist',

  UNKNOWN_ISSUE = 'Unknown issue'
}
