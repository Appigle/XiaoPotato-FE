stateDiagram-v2
    [*] --> Idle
    Idle --> Composing: User initiates post creation
    Composing --> MediaSelection: User adds text
    MediaSelection --> MediaEditing: User selects media
    MediaEditing --> Preview: User finishes editing
    Preview --> Publishing: User confirms post
    Publishing --> Published: System processes and posts
    Published --> [*]
    
    Composing --> Idle: User cancels
    MediaSelection --> Composing: User removes media
    MediaSelection --> Idle: User cancels
    MediaEditing --> MediaSelection: User changes selection
    MediaEditing --> Idle: User cancels
    Preview --> Composing: User edits text
    Preview --> MediaSelection: User changes media
    Preview --> Idle: User cancels
    Publishing --> Error: System encounters error
    Error --> Preview: User retries
    Error --> Idle: User cancels
