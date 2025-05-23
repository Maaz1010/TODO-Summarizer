package com.todo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/todos")
@CrossOrigin(origins = "*")
public class TodoController {

    @Autowired
    private TodoRepository todoRepository;

    @GetMapping
    public List<TodoEntity> getAllTodos() {
        return todoRepository.findAll();
    }

    @PostMapping
    public TodoEntity addTodo(@RequestBody TodoEntity todo) {
        return todoRepository.save(todo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        todoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/summarize")
    public ResponseEntity<String> summarizeTodos() {
        List<TodoEntity> todos = todoRepository.findAll();
        String pendingTasks = todos.stream()
            .filter(t -> !t.isCompleted())
            .map(TodoEntity::getTask)
            .collect(Collectors.joining("\n"));

        String prompt = "Summarize these todos:\n" + pendingTasks;

        String summary = callGemini(prompt);
        return ResponseEntity.ok(summary);
    }

    private String callGemini(String prompt) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String body = """
        {
          "contents": [
            {
              "parts": [
                { "text": "%s" }
              ]
            }
          ]
        }
        """.formatted(prompt);

        HttpEntity<String> request = new HttpEntity<>(body, headers);
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + System.getenv("GEMINI_API_KEY"),
                request,
                String.class
            );
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                
                return response.getBody();
            } else {
                return "Failed to get summary from Gemini API.";
            }
        } catch (Exception e) {
            return "Error calling API: " ;//+ e.getMessage();
        }
    }
}
