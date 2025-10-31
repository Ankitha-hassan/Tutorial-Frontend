import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Import CodeMirror modes & themes
import 'codemirror/mode/python/python';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/clike/clike';
import 'codemirror/theme/material.css';

interface Language {
  id: string;
  name: string;
  mode: string;
  template: string;
}

@Component({
  selector: 'app-ide-runner',
  standalone: true,
  imports: [CommonModule, FormsModule, CodemirrorModule, HttpClientModule],
  templateUrl: './ide-runner.html',
  styleUrls: ['./ide-runner.css']
})
export class IdeRunnerComponent implements OnInit, OnDestroy {
  @Input() language: string = 'python';
  
  code: string = '';
  stdin: string = ''; // NEW: Input field
  output: string = '';
  isRunning = false;
  editorInstance: any;
  copySuccess = false;
  showInputSection = false; // NEW: Toggle input section
  
  private destroy$ = new Subject<void>();
  private readonly API_URL = 'http://localhost:9090/api/v1/Ide/run';

  languages: Language[] = [
    {
      id: 'python',
      name: 'Python',
      mode: 'python',
      template: '# Python Code with Input\nname = input()\nage = input()\nprint(f"Hello {name}, you are {age} years old!")'
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      mode: 'javascript',
      template: '// JavaScript Code\nconsole.log("Hello, World!");\n\nfor (let i = 0; i < 5; i++) {\n  console.log(`Number ${i}`);\n}'
    },
    {
      id: 'java',
      name: 'Java',
      mode: 'text/x-java',
      template: 'import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n int a = sc.nextInt();\n  int b = sc.nextInt();\n    \n    if(a > b) {\n      System.out.println(a + " is greater than " + b);\n    } else {\n      System.out.println(a + " is less than " + b);\n    }\n    \n    sc.close();\n  }\n}'
    },
    {
      id: 'csharp',
      name: 'C#',
      mode: 'text/x-csharp',
      template: 'using System;\n\nclass Program {\n  static void Main() {\n    Console.WriteLine("Enter your name: ");\n    string name = Console.ReadLine();\n    \n    Console.WriteLine("Enter your age: ");\n    int age = int.Parse(Console.ReadLine());\n    \n    Console.WriteLine($"Hello {name}, you are {age} years old!");\n  }\n}'
    }
  ];

  editorOptions: any = {
    lineNumbers: true,
    theme: 'material',
    tabSize: 2,
    mode: 'python',
    lineWrapping: true,
    readOnly: false,
    autoCloseBrackets: true,
    matchBrackets: true,
    indentUnit: 2,
    smartIndent: true,
    extraKeys: {
      'Ctrl-Enter': () => this.runCode(),
      'Cmd-Enter': () => this.runCode()
    }
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadDefaultCode(this.language);
    this.updateEditorMode();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDefaultCode(lang: string) {
    const language = this.languages.find(l => l.id === lang);
    this.code = language?.template || this.languages[0].template;
    
    // Auto-show input section for languages that typically need input
    this.showInputSection = ['python', 'java', 'csharp'].includes(lang);
    
    // Set sample input based on language
    if (lang === 'java') {
      this.stdin = '10\n5'; // Two numbers for comparison
    } else if (lang === 'python' || lang === 'csharp') {
      this.stdin = 'John\n25'; // Name and age
    } else {
      this.stdin = '';
    }
  }

  onLanguageChange(event: any) {
    this.language = event.target.value;
    this.loadDefaultCode(this.language);
    this.updateEditorMode();
    this.output = '';
  }

  updateEditorMode() {
    const language = this.languages.find(l => l.id === this.language);
    this.editorOptions.mode = language?.mode || 'python';
    
    this.editorOptions = { ...this.editorOptions };
    
    setTimeout(() => {
      if (this.editorInstance) {
        this.editorInstance.refresh();
        this.editorInstance.focus();
      }
    }, 100);
  }

  toggleInputSection() {
    this.showInputSection = !this.showInputSection;
  }

  runCode() {
    if (this.isRunning) {
      console.log('Code is already running...');
      return;
    }
    
    if (!this.code.trim()) {
      this.output = 'Error: No code to execute';
      return;
    }

    this.isRunning = true;
    this.output = 'Running...';

    // ✅ FIXED: Always include stdin in request, even if empty
    const request = { 
      language: this.language, 
      code: this.code,
      stdin: this.stdin || '' // Send empty string if not provided
    };

    // Debug logging
    console.log('=== DEBUG INFO ===');
    console.log('Language:', request.language);
    console.log('Code length:', request.code.length);
    console.log('Stdin provided:', request.stdin);
    console.log('Full request:', JSON.stringify(request, null, 2));
    console.log('==================');

    this.http.post<any>(this.API_URL, request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          console.log('✅ Received response:', res);
          this.output = res.output || 'No output.';
          this.isRunning = false;
        },
        error: (err: any) => {
          console.error('❌ Execution error:', err);
          console.error('Error status:', err.status);
          console.error('Error details:', err.error);
          
          if (err.status === 429) {
            this.output = 'Error: Too many requests. Please wait a moment and try again.';
          } else if (err.status === 503) {
            this.output = 'Error: Code execution service is temporarily unavailable. Please try again later.';
          } else if (err.status === 408) {
            this.output = 'Error: Code execution timed out. Your code may be taking too long to execute.';
          } else if (err.status === 400) {
            this.output = `Error: ${err.error?.error || 'Invalid request'}`;
          } else {
            this.output = `Error: ${err.error?.error || err.message || 'Failed to execute code. Please try again.'}`;
          }
          
          this.isRunning = false;
        }
      });
  }

  onEditorInit(editor: any) {
    console.log('Editor initialized:', editor);
    this.editorInstance = editor;
    
    setTimeout(() => {
      editor.refresh();
      editor.focus();
    }, 100);
  }

  copyCode() {
    console.log('Copy button clicked');
    console.log('Editor instance:', this.editorInstance);
    console.log('Code value:', this.code);

    // Try to get code from editor instance first, fallback to code variable
    let codeToCopy = '';
    
    if (this.editorInstance) {
      try {
        codeToCopy = this.editorInstance.getValue();
        console.log('Got code from editor instance');
      } catch (err) {
        console.error('Error getting code from editor:', err);
        codeToCopy = this.code;
      }
    } else {
      codeToCopy = this.code;
      console.log('Using code from variable');
    }
    
    if (!codeToCopy || !codeToCopy.trim()) {
      alert('No code to copy');
      return;
    }

    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => {
          console.log('✅ Code copied successfully via Clipboard API');
          this.copySuccess = true;
          setTimeout(() => {
            this.copySuccess = false;
          }, 2000);
        })
        .catch(err => {
          console.error('❌ Clipboard API failed:', err);
          this.fallbackCopy(codeToCopy);
        });
    } else {
      // Fallback for older browsers
      console.log('Using fallback copy method');
      this.fallbackCopy(codeToCopy);
    }
  }

  private fallbackCopy(text: string) {
    // Create temporary textarea
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.width = '1px';
    textarea.style.height = '1px';
    textarea.style.opacity = '0';
    
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        console.log('✅ Code copied via fallback method');
        this.copySuccess = true;
        setTimeout(() => {
          this.copySuccess = false;
        }, 2000);
      } else {
        console.error('❌ Fallback copy failed');
        alert('Failed to copy code. Please copy manually.');
      }
    } catch (err) {
      console.error('❌ Fallback error:', err);
      alert('Failed to copy code. Please copy manually.');
    } finally {
      document.body.removeChild(textarea);
    }
  }

  private showCopyError() {
    alert('Failed to copy code to clipboard. Please try copying manually (Ctrl+A, Ctrl+C).');
  }

  clearCode() {
    if (this.isRunning) {
      return;
    }
    
    this.loadDefaultCode(this.language);
    this.output = '';
    
    if (this.editorInstance) {
      this.editorInstance.focus();
    }
  }

  get currentLanguageName(): string {
    return this.languages.find(l => l.id === this.language)?.name || 'Unknown';
  }

  get lineCount(): number {
    return this.code.split('\n').length;
  }

  get inputCount(): number {
    return this.stdin.split('\n').filter(line => line.trim().length > 0).length;
  }
}