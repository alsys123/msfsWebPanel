;; Basic UI cleanup
;(menu-bar-mode -1)
;(tool-bar-mode -1)
;(scroll-bar-mode -1)

;; Use white on black in GUI frames
(when (display-graphic-p)
  (set-foreground-color "white")
  (set-background-color "black")
  (set-cursor-color "yellow"))

;; For terminal Emacs, try to force similar colors
(unless (display-graphic-p)
  (set-face-attribute 'default nil
                      :foreground "white"
                      :background "black"))

;; Optional: slightly larger, readable font in GUI
;(when (display-graphic-p)
;  (set-face-attribute 'default nil :height 110))
;; Increase GUI font size (height is 1/10 pt)
(when (display-graphic-p)
  (set-face-attribute 'default nil :height 160))

;; Set initial frame size: 12 rows x 43 columns0
(add-to-list 'default-frame-alist '(height . 40))
(add-to-list 'default-frame-alist '(width . 90))
(add-to-list 'default-frame-alist '(top . 50))
(add-to-list 'default-frame-alist '(left . 550))
;(custom-set-variable
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
; '(inhibit-startup-screen t))
;(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 ;)

;; Increase GUI font size (height is 1/10 pt)
;(when (display-graphic-p)
;  (set-face-attribute 'default nil :height 150))
(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(inhibit-startup-screen t))
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )

(defun beginning-of-next-line ()
  "Move point to the beginning of the next line."
  (interactive)
  (forward-line 1)
  (move-beginning-of-line 1))

(global-set-key (kbd "<kp-0>") 'beginning-of-next-line)
(global-set-key (kbd "<kp-2>") 'move-end-of-line)
(global-set-key (kbd "<kp-6>") 'kill-region)
(global-set-key (kbd "<kp-9>") 'yank)
(global-set-key (kbd "<kp-add>") 'delete-char)
(global-set-key (kbd "<kp-decimal>") 'set-mark-command)

(global-set-key (kbd "<f12>") 'call-last-kbd-macro)

