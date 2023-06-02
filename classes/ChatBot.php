<?php

class ChatBot {

    function __construct() {
        
        //echo json_encode("THIS IS THE PHP CLASS SPEAKING");
        session_start();

        //echo json_encode($_GET["q"]);
        
        if(isset($_REQUEST["q"]))
            $this->LoadAnswers($_REQUEST["q"]);
        
        //views/chatbot.php?record=bumblebee%20is%20a%20flying%20object&keyword=Bumblebee".
        if(isset($_REQUEST["record"]) && isset($_REQUEST["keyword"]))
            $this->StoreDefinition($_REQUEST["record"], $_REQUEST["keyword"]);

        // views/chatbot.php?store-user=Peter
        if(isset($_REQUEST["store-user"]))
            $this->StoreUser($_REQUEST["store-user"]);

        if(isset($_REQUEST["get-user"]) && isset($_SESSION["active-user"]))
            $this->GetUser();

    }

    public function StoreDefinition($definition, $keyword) {

        $definition = strip_tags($definition);
        $keyword = strip_tags($keyword);

        require_once("../db.php");
        
        if ($conn) {
            $sql = "INSERT INTO q_and_a (`question`, `answers`) VALUES (?,?)";
            $insertedRows = 0;
            if ($insertStmt = $conn->prepare($sql)) {
                $insertStmt->bind_param('ss', $keyword, $definition);
                $insertStmt->execute();
                $insertedRows += $insertStmt->affected_rows;
                if ($insertedRows > 0) {
                    $rArray[] = [
                        "id"=>$insertStmt->insert_id,
                        "status"=>"DATA SAVED" 
                    ];
                } else {
                    $rArray[] = [
                        "error"=>"nothing inserted"
                    ];
                }
                $insertStmt->close();
            } else {
                $rArray[] = [
                    "error"=>"No execute statement. Query Error - Double check your query and inputs"
                ];
            }
            $conn->close();
        } else {
            $rArray[] = [
                "error"=> "Connection Error: " . mysqli_connect_error(),
            ];
        }
        echo json_encode($rArray);
    }

    public function GetUser() {
        require_once("../db.php");
        if ($conn) {
            $sql = "SELECT * FROM profiles WHERE id = ? LIMIT 1";
            $rArray = array();
            if ($stmt = $conn->prepare($sql)) {
                $stmt->bind_param('i', $_SESSION["active-user"]);
                $stmt->execute();
                $stmt->store_result();
                $stmt->bind_result($id, $name, $likes); //Here put the code to setup the bind_result
                while($stmt->fetch()) {
                    $rArray[] = [
                        // write your own output array
                        "id" => $id,
                        "name" => $name,
                        "likes" => $likes
                    ];
                }
                $stmt->close();        
            }
            else {
                $rArray[] = [
                    "error"=>"No execute statement. Query Error - Double check your query and inputs"
                ];
            }
            $conn->close();
        }
        else {
            $rArray[] = [
                "error"=> "Connection Error: " . mysqli_connect_error(),
            ];
        }
        echo json_encode($rArray);
    }

    public function StoreUser($user) {

        $user_clean = strip_tags(trim($user));

        require_once("../db.php");
        if ($conn) {
            //echo("OK");
            //Build the SQL query
            /* ? HERE Collect the data from the HTML form using $_REQUEST[] */
            //$sql = "INSERT INTO xyz_messages (`message`, `uid`) VALUES (?,?)";
            $sql = "INSERT INTO profiles (`name`) VALUES (?)";    // Write a query to add data in your table
            //This should contain 1 when the line is inserted
            $insertedRows = 0;
        
            //prepare statement, execute, store_result
            if ($insertStmt = $conn->prepare($sql)) {
                //update bind parameter types & variables as required
                //s=string, i=integer, d=double, b=blob
                
                $insertStmt->bind_param('s', $user_clean); //Here put the code to setup the bind_param
                $insertStmt->execute();
                $insertedRows += $insertStmt->affected_rows;
        
                if ($insertedRows > 0) {
                    //return inserted row id
                    $rArray[] = [
                        "id"=>$insertStmt->insert_id
                    ];
                } else {
                    $rArray[] = [
                        "error"=>"nothing inserted"
                    ];
                }
        
                $_SESSION["active-user"] = $insertStmt->insert_id;
                $insertStmt->close();
        
            } else {
                //Inform user if error
                $rArray[] = [
                    "error"=>"No execute statement. Query Error - Double check your query and inputs"
                ];
            }
        
            $conn->close();
        
        } else {
            //Inform user if error
            $rArray[] = [
                "error"=> "Connection Error: " . mysqli_connect_error(),
            ];
        }
        
        echo json_encode($rArray);
    }

    public function LoadAnswers($command) {
        require_once("../db.php");
        if ($conn) {
            // SQL query
            
            //// Keyword comparison
            //$keyword = "%".$command."%";
            //$sql = "SELECT * FROM q_and_a WHERE question LIKE ? LIMIT 1";
            
            //// Word by word comparison
            $keyword = trim(strip_tags($command));
            $sql = "SELECT * FROM q_and_a WHERE question = ? LIMIT 1";
        
            // Array to translate to json
            $rArray = array();
        
            if ($stmt = $conn->prepare($sql)) {
                //Prepare input
                /* ??? HERE Collect the data from the HTML form using $_REQUEST[] */
                //Here it is important to follow the order in the bind_param, be careful to not change things
                // $stmt->bind_param(/* ??? */);//Here put the code to setup the bind_param
                $stmt->bind_param('s', $keyword);
                //Prepare output
                $stmt->execute();
                $stmt->store_result();
                
                $stmt->bind_result($id, $question, $answers); //Here put the code to setup the bind_result
        
                //Collect results
                while($stmt->fetch()) {
                    $rArray[] = [
                        // write your own output array
                        "id" => $id,
                        "question" => $question,
                        "answers" => $answers
                    ];
                }
                        
                $stmt->close();        
           
            }
            else {
                //Inform user if error
                $rArray[] = [
                    "error"=>"No execute statement. Query Error - Double check your query and inputs"
                ];
            }
        
            $conn->close();
        }
        else {
            //Inform user if error
            $rArray[] = [
                "error"=> "Connection Error: " . mysqli_connect_error(),
            ];
        }
        
        echo json_encode($rArray);

    }

    // public function UpdateMessages($lastIdLoaded) {
    //     require_once("../db.php");
    //     //$lastIdLoaded = (int)$lastIdLoaded;
    //     //echo json_encode(["nothing" => "yet"]);
    //     //echo json_encode(["lastIDLoaded" => $lastIdLoaded]);
    //     if ($conn) {
    //         $sql = "SELECT * FROM xyz_messages WHERE xyz_messages.id > ?;";//ORDER BY id DESC ////LIMIT 1 ORDER BY id DESC
    //         $rArray = array();
    //         if ($stmt = $conn->prepare($sql)) {
    //             $stmt->bind_param("i", $lastIdLoaded);
    //             $stmt->execute();
                
    //             $stmt->store_result();
    //             $stmt->bind_result($id, $message, $uid);
                
    //             while($stmt->fetch()) {
    //                 $rArray[] = [
    //                     "id" => $id,
    //                     "msg" => $message,
    //                     "uid" => $uid
    //                 ];
    //             }
    //             $stmt->close();
    //         } else {
    //             $rArray[] = [
    //                 "error"=>"No execute statement. Query Error - Double check your query and inputs"
    //             ];
    //         }
    //         $conn->close();
    //     } else {
    //         $rArray[] = [
    //             "error"=> "Connection Error: " . mysqli_connect_error(),
    //         ];
    //     }
    //     echo json_encode($rArray);
    // }





}
?>