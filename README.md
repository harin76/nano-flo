# nano-flo
A light weight, fast and pragmatic workflow engine for nodejs

```
workflow:
  name: 'Customer Creation'
  created: '2017-04-20 16:56:01'
  updated: '2017-04-20 16:56:01'
  author: 'John Doe'
  version: '1'
  tasks:
    - name: 'start'
      id: CC001
      predecessors: []
      successor: 'Create Customer'
      params:
        - source:
            type: string
            required: true
            default: user
        - user:
            type: string
            required: true
        - role:
            type: string
            required: true
      script: |
        status="initial"
      onError:
    - name: 'Create Customer'
      id: CC002
      predecessors: [start]
      successor: 'Approve Customer'
      params:
        - source:
            type: string
            required: true
            default: user
        - user:
            type: string
            required: true
        - role:
            type: string
            required: true
      script: |
        status="created"
      onError:
    - name: 'Approve Customer'
      id: CC003
      predecessors: [Create Customer, Modify Customer]
      successor: 'Approve Customer'
      params:
        - source:
            type: string
            required: true
            default: user
        - user:
            type: string
            required: true
        - role:
            type: string
            required: true
      script: |
        status="approved"
      onError:
    - name: 'stop'
      id: CC004
      predecessors: ['Approve Customer']
      successor:
      params:
        - source:
            type: string
            required: true
            default: user
        - user:
            type: string
            required: true
        - role:
            type: string
            required: true
      script:
      onError:
```
