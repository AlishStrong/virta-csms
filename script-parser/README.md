## **Task 2 - Script Parser**
This is an implementation of the second task, where it was requested to create a script parser that will accept specific commands from users, process them, and upon the termination command, disclose the complete result of processing actions.
<br>
The project was written with `NodeJS`.
<hr>

**Important!**
<br>
The Script Parser requires `api-backend` service to be up and running.
<br>
Please refer to the instructions on how to start the `api-backend` service and `MySQL` database from the other README file.
<br>
<hr>

### **Starting the script parser**
Open terminal in the root directory of `script-parser` project.
<br>
Execute the following command:
```
npm run start
```
or just
```
npm start
```
This will start the project.
By default, the system is prompting user to input and submit a command through a `readline` interface.
Program accepts the following commands:
- `Begin` - must be always provided first!
- `End` - the last command. Its execution will terminate the process and output the results of the command executions as required in the task's description;
- `Wait amount-in-seconds` - e.g. **Wait 10** - does appear in the final output, but changes the UNIX-`timestamp` of the subsequent command execution by the supplied amount of seconds;
- `Start|Stop station ID|all` - use to start or stop a station by its ID or all stations if the last argument is **all**. E.g.:
  - `Start station 1`,
  - `Start station all`,
  - `Stop station all`,
  - `Stop station 5`  

If the command that you provide is incorrect or called in a wrong order, the app will notify you about that. 
However, only `End` command will terminate the process and output the overall result!
<hr>

**Important!**
<br>
`Script Parser` has `.env` file in its root. The file defines values for `CLIENT_HOST` and `CLIENT_PORT` variables, which are used to make requests to `api-backend` service. If any of the values of your actual running `api-service` is different, then update those values.
<br>
<hr>

### **Building script parser**
Open terminal in the root directory of `script-parser` project.
<br>
Execute the following command:
```
npm run build
```
Then you can run the built project by calling
```
npm run start:built
```

**NB!** you still need other services running for the parser to properly work.
