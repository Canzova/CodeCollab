import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/mode/javascript/javascript";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
import ACTIONS from "../ACTIONS";

export default function Editor({ socketRef, roomId, onCodeChange }) {
  const editorRef = useRef(null);
  useEffect(() => {
    async function init() {
      // Storing whatever user is writing into editorRef.current
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById("realtimeeditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoClosetags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );

      // We get chnage from codeMirror
      editorRef.current.on("change", (instance, changes) => {
        // console.log("Changes", changes)

        // In origin we will have what type of change it is cut, copy, paste, add, substract etc
        const { origin } = changes;

        // With getvalue we will get what ever is written on the code mirror
        const code = instance.getValue();

        // Updating the onCodeChange function with current code
        onCodeChange(code);
        
        // Not equal to set value because origin will be equal to setvaue only when if we have explicitly added something into code
        
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }
    init();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      // Saving code
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  return <textarea id="realtimeeditor"></textarea>;
}
