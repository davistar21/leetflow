import json
import os
import sys

PROGRESS_FILE = "progress.json"

def load_progress():
    if not os.path.exists(PROGRESS_FILE):
        # Default start at Day 3 as requested if no file exists
        return {"day": 3, "last_thread_id": None}
    
    try:
        with open(PROGRESS_FILE, 'r') as f:
            return json.load(f)
    except json.JSONDecodeError:
        return {"day": 3, "last_thread_id": None}

def save_progress(day, thread_id):
    data = {"day": day, "last_thread_id": thread_id}
    with open(PROGRESS_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def get_next_day():
    progress = load_progress()
    return progress.get("day", 0) + 1

def get_last_thread_id():
    progress = load_progress()
    return progress.get("last_thread_id")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python progress_tracker.py <command> [args]")
        print("Commands: get_day, get_thread, update <day> <thread_id>")
        sys.exit(1)

    command = sys.argv[1]
    
    if command == "get_day":
        print(get_next_day())
    elif command == "get_thread":
        print(get_last_thread_id() or "")
    elif command == "update":
        if len(sys.argv) < 4:
            print("Usage: python progress_tracker.py update <day> <thread_id>")
            sys.exit(1)
        day = int(sys.argv[2])
        thread_id = sys.argv[3]
        save_progress(day, thread_id)
        print("Progress updated")
    elif command == "set_day":
        if len(sys.argv) < 3:
            print("Usage: python progress_tracker.py set_day <day>")
            sys.exit(1)
        day = int(sys.argv[2])
        current_thread_id = get_last_thread_id()
        save_progress(day, current_thread_id)
        print("Day updated")
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)
