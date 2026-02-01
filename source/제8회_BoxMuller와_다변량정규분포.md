# 제8회 Box-Muller 방법과 다변량 정규분포

## 1. 변수변환 공식 복습

### 설정
- 원래 변수: $(X, Y)$ with 밀도 $f(x,y)$
- 새 변수: $(U, V)$ with 밀도 $g(u,v)$
- 변환: $x = x(u,v)$, $y = y(u,v)$

### 공식
$$g(u,v) = f(x(u,v), y(u,v)) \cdot |J|$$

---

## 2. 표준정규분포의 극좌표 변환

### 설정
$$X \sim N(0,1), \quad Y \sim N(0,1), \quad X \perp Y$$

$$f(x,y) = \frac{1}{2\pi} e^{-\frac{x^2+y^2}{2}}$$

### 변환
$$X = R\cos\Theta, \quad Y = R\sin\Theta$$

### 야코비안
$$|J| = r$$

### (R, Θ)의 동시밀도
$$g(r,\theta) = f(r\cos\theta, r\sin\theta) \cdot r = \frac{1}{2\pi} e^{-\frac{r^2}{2}} \cdot r$$

---

## 3. R과 Θ는 독립!

### 동시밀도의 분해
$$g(r,\theta) = \underbrace{\frac{1}{2\pi}}_{g_\Theta(\theta)} \times \underbrace{r e^{-\frac{r^2}{2}}}_{g_R(r)}$$

### 주변밀도

**Θ의 분포:**
$$g_\Theta(\theta) = \frac{1}{2\pi}, \quad 0 \leq \theta < 2\pi$$
$$\Theta \sim \text{Uniform}[0, 2\pi]$$

**R의 분포:**
$$g_R(r) = r e^{-\frac{r^2}{2}}, \quad r \geq 0$$

> 이걸 **레일리 분포** (Rayleigh distribution)라고 함

---

## 4. R의 누적분포함수

$$F_R(r) = P(R \leq r) = \int_0^r t e^{-\frac{t^2}{2}} dt = 1 - e^{-\frac{r^2}{2}}$$

---

## 5. 역변환법 (Inverse Transform Method)

### 아이디어
균등분포 난수 V로부터 다른 분포의 난수 X를 생성

### 방법
$$V \sim \text{Uniform}[0,1]$$
$$X = F^{-1}(V)$$

그러면 $X \sim F(x)$

### 왜 성립하나?
$$P(X \leq x) = P(F^{-1}(V) \leq x) = P(V \leq F(x)) = F(x)$$

---

## 6. 지수분포 난수 생성 (예제)

### 지수분포의 CDF
$$F(x) = 1 - e^{-\lambda x}$$

### 역함수
$y = 1 - e^{-\lambda x}$ 를 x에 대해 풀면:
$$x = -\frac{1}{\lambda}\log(1-y) = F^{-1}(y)$$

### 생성법
$$V \sim \text{Uniform}[0,1]$$
$$X = -\frac{1}{\lambda}\log(1-V)$$

그러면 $X \sim \text{Exponential}(\lambda)$

---

## 7. Box-Muller 방법

### 문제
정규분포의 CDF는 **초등함수로 표현 불가** → 직접 역변환 불가!

### 해결책: 극좌표 이용

**Step 1: 균등분포 난수 2개 생성**
$$V_1, V_2 \sim \text{Uniform}[0,1]$$

**Step 2: Θ와 R 생성**
$$\Theta = 2\pi V_1 \sim \text{Uniform}[0, 2\pi]$$

R의 CDF가 $F_R(r) = 1 - e^{-r^2/2}$ 이므로:
$$R = \sqrt{-2\log(1-V_2)} = \sqrt{-2\log V_2}$$

(V₂와 1-V₂ 는 같은 분포)

**Step 3: 정규난수 생성**
$$X = R\cos\Theta = \sqrt{-2\log V_2} \cos(2\pi V_1)$$
$$Y = R\sin\Theta = \sqrt{-2\log V_2} \sin(2\pi V_1)$$

### 결과
$$X \sim N(0,1), \quad Y \sim N(0,1)$$

> **균등분포 2개 → 표준정규분포 2개!**

---

## 8. 이변량 정규분포 (행렬 표기)

### 평균 벡터
$$\boldsymbol{\mu} = \begin{pmatrix} \mu_1 \\ \mu_2 \end{pmatrix}$$

### 공분산 행렬
$$\boldsymbol{\Sigma} = \begin{pmatrix} \sigma_1^2 & \rho\sigma_1\sigma_2 \\ \rho\sigma_1\sigma_2 & \sigma_2^2 \end{pmatrix}$$

### 밀도함수 (행렬 표기)
$$f(\mathbf{x}) = \frac{1}{2\pi|\boldsymbol{\Sigma}|^{1/2}} \exp\left(-\frac{1}{2}(\mathbf{x}-\boldsymbol{\mu})^T \boldsymbol{\Sigma}^{-1} (\mathbf{x}-\boldsymbol{\mu})\right)$$

여기서:
- $\mathbf{x} = (x_1, x_2)^T$
- $|\boldsymbol{\Sigma}|$ = 행렬식 = $\sigma_1^2\sigma_2^2(1-\rho^2)$

---

## 9. 핵심 공식 정리

| 개념 | 공식 |
|---|---|
| Θ 분포 | Uniform[0, 2π] |
| R 분포 | $g_R(r) = re^{-r^2/2}$ (레일리) |
| R 생성 | $R = \sqrt{-2\log V}$ |
| Box-Muller | $X = R\cos\Theta$, $Y = R\sin\Theta$ |

---

## 10. 이 강의의 핵심 메시지

1. **극좌표 변환으로 R과 Θ 분리**
   - 각각 독립이고 분포가 간단함

2. **역변환법**
   - 균등분포 → 원하는 분포로 변환

3. **Box-Muller 방법**
   - 정규분포 CDF가 없어도 난수 생성 가능
   - 균등분포 2개 → 표준정규 2개

4. **행렬 표기로의 전환**
   - 다변량 정규분포 준비

---

## 11. Q&A

### Q1. 왜 √(-2 log V) 인가?

R의 CDF: $F_R(r) = 1 - e^{-r^2/2}$

역함수: $r = \sqrt{-2\log(1-v)}$

V와 1-V는 같은 Uniform[0,1] 분포이므로 $\sqrt{-2\log V}$ 사용

### Q2. Box-Muller의 장점?

- 정규분포 CDF 계산 필요 없음
- 한 번에 **2개**의 정규난수 생성
- 매우 효율적!
