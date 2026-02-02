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

### 핵심 아이디어
**"균등분포의 역함수"가 아니라, "목표 분포의 CDF의 역함수"를 사용!**

- 컴퓨터는 $V \sim \text{Uniform}[0,1]$ (0~1 사이 무작위 숫자)를 쉽게 생성
- 하지만 우리가 원하는 건 지수분포, 정규분포 등의 난수
- **해결:** 목표 분포의 CDF 역함수에 균등분포 난수를 넣으면 됨!

### 방법
$$V \sim \text{Uniform}[0,1]$$
$$X = F^{-1}(V)$$

그러면 $X \sim F(x)$

> **한 줄 요약:** 균등분포 난수 → CDF 역함수 → 원하는 분포의 난수 🎲

### 직관적 이해

CDF $F(x) = P(X \leq x)$는 항상 **0에서 1 사이**의 값을 가짐:
- 균등분포 $V$는 0~1 사이를 "균등하게" 뿌림
- 이 $V$값을 **y축에서 수평으로 쏴서** CDF 곡선과 만나는 점의 **x좌표**가 $F^{-1}(V)$
- CDF가 가파른 곳(확률밀도 높은 곳) → 더 많은 $V$값이 맵핑됨!

### 왜 성립하나? (수학적 증명)
$$P(X \leq x) = P(F^{-1}(V) \leq x) = P(V \leq F(x)) = F(x)$$

$V$가 균등분포이므로 $P(V \leq F(x)) = F(x)$가 성립 → $X$의 CDF가 $F(x)$!

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

### 문제: 정규분포 역변환이 왜 안 되는가?

역변환법을 쓰려면 CDF의 역함수 $F^{-1}(v)$가 필요한데, 정규분포의 CDF는:
$$\Phi(x) = \int_{-\infty}^{x} \frac{1}{\sqrt{2\pi}} e^{-\frac{t^2}{2}} dt$$

**이 적분은 닫힌 형태(closed form)로 표현 불가!** 😵

즉, $\Phi^{-1}(v)$를 수식으로 쓸 수 없음 → 역변환법 직접 사용 불가

### 해결책: 극좌표로 우회!

정규분포를 **직접** 건드리지 않고, **극좌표에서 우회**:

```
정규분포 (X, Y)
      ↓ 극좌표 변환
(R, Θ) ← 이건 역변환 가능!
      ↓
R ~ 레일리 분포 (역변환 가능 ✅)
Θ ~ 균등분포 (역변환 불필요 ✅)
      ↓
균등분포 2개로 R, Θ 생성
      ↓ 다시 직교좌표로
정규분포 (X, Y) 얻음!
```

| 분포 | 역변환 가능? |
|------|-------------|
| 정규분포 $N(0,1)$ | ❌ 불가능 |
| 레일리 분포 $R$ | ✅ 가능 |
| 균등분포 $\Theta$ | ✅ 필요없음 (이미 균등) |

> **Box-Muller = 정규분포를 극좌표로 분해해서, 역변환 가능한 분포들로 우회하는 방법!**

### 구체적 절차

**Step 1: 균등분포 난수 2개 생성**
$$V_1, V_2 \sim \text{Uniform}[0,1]$$

**Step 2: Θ와 R 생성**
$$\Theta = 2\pi V_1 \sim \text{Uniform}[0, 2\pi]$$

R의 CDF가 $F_R(r) = 1 - e^{-r^2/2}$ 이므로:
$$R = \sqrt{-2\log(1-V_2)} = \sqrt{-2\log V_2}$$

**왜 $V_2$와 $1-V_2$가 같은 분포인가?**

$V \sim \text{Uniform}[0,1]$이므로 $V$는 **0과 1 사이**

| $V$의 값 | $1 - V$의 값 |
|---------|-------------|
| $V = 0$ | $1 - 0 = 1$ |
| $V = 0.3$ | $1 - 0.3 = 0.7$ |
| $V = 0.5$ | $1 - 0.5 = 0.5$ |
| $V = 1$ | $1 - 1 = 0$ |

**$1 - V$의 범위도 $[0, 1]$!** ($-V$는 $[-1, 0]$이지만, $1-V$는 다름!)

균등분포는 **0.5를 중심으로 완벽히 대칭**이기 때문:
- $V$가 0에 가까우면 → $1-V$는 1에 가까움
- $V$가 1에 가까우면 → $1-V$는 0에 가까움
- 수학적 증명: $P(1-V \leq w) = P(V \geq 1-w) = w$ → $\text{Uniform}[0,1]$

따라서 계산 편의상 $\sqrt{-2\log(1-V_2)}$ 대신 $\sqrt{-2\log V_2}$ 사용!

**Step 3: 정규난수 생성**
$$X = R\cos\Theta = \sqrt{-2\log V_2} \cos(2\pi V_1)$$
$$Y = R\sin\Theta = \sqrt{-2\log V_2} \sin(2\pi V_1)$$

### 결과
$$X \sim N(0,1), \quad Y \sim N(0,1)$$

> **균등분포 2개 → 표준정규분포 2개!**

---

## 8. 이변량 정규분포 (행렬 표기)

### 왜 벡터/행렬로 표현하나?
다변량(2개, 3개, ... n개 변수)일 때 개별적으로 쓰면 너무 복잡해짐:

| 변수 개수 | 개별 표기 | 벡터 표기 |
|-----------|-----------|-----------|
| 2개 | $\mu_1, \mu_2$ | $\boldsymbol{\mu}$ |
| 100개 | $\mu_1, \mu_2, ..., \mu_{100}$ | $\boldsymbol{\mu}$ |

**일반화가 쉬워**지고, 수식도 깔끔해짐!

### 평균 벡터
$$\boldsymbol{\mu} = \begin{pmatrix} \mu_1 \\ \mu_2 \end{pmatrix}$$

### 공분산 행렬
$$\boldsymbol{\Sigma} = \begin{pmatrix} \sigma_1^2 & \rho\sigma_1\sigma_2 \\ \rho\sigma_1\sigma_2 & \sigma_2^2 \end{pmatrix}$$

**각 요소의 의미:**
| 위치 | 의미 |
|------|------|
| (1,1) | $\text{Var}(X_1) = \sigma_1^2$ |
| (2,2) | $\text{Var}(X_2) = \sigma_2^2$ |
| (1,2), (2,1) | $\text{Cov}(X_1, X_2) = \rho\sigma_1\sigma_2$ |

**왜 $\rho\sigma_1\sigma_2$인가?**
공분산의 정의: $\text{Cov}(X_1, X_2) = \rho \cdot \sigma_1 \cdot \sigma_2$

여기서 $\rho$는 **상관계수** (correlation coefficient, -1 ~ 1 사이):
$$\rho = \frac{\text{Cov}(X_1, X_2)}{\sigma_1 \sigma_2}$$

만약 $\rho = 0$이면 공분산도 0 → 두 변수가 독립!

### 밀도함수 (행렬 표기)
$$f(\mathbf{x}) = \frac{1}{2\pi|\boldsymbol{\Sigma}|^{1/2}} \exp\left(-\frac{1}{2}(\mathbf{x}-\boldsymbol{\mu})^T \boldsymbol{\Sigma}^{-1} (\mathbf{x}-\boldsymbol{\mu})\right)$$

여기서:
- $\mathbf{x} = (x_1, x_2)^T$ ← **2차원 평면 위의 한 점을 세로 벡터로 표현**
- $|\boldsymbol{\Sigma}|$ = 행렬식 = $\sigma_1^2\sigma_2^2(1-\rho^2)$

### 전치(Transpose) 표기: $T$
$$\mathbf{x}^T = \begin{pmatrix} x_1 \\ x_2 \end{pmatrix}^T = \begin{pmatrix} x_1 & x_2 \end{pmatrix}$$

- $\mathbf{x}$: 2×1 (세로 벡터)
- $\mathbf{x}^T$: 1×2 (가로 벡터)

**밀도함수의 차원 계산:**
$$\underbrace{(1 \times 2)}_{(\mathbf{x}-\boldsymbol{\mu})^T} \times \underbrace{(2 \times 2)}_{\boldsymbol{\Sigma}^{-1}} \times \underbrace{(2 \times 1)}_{(\mathbf{x}-\boldsymbol{\mu})} = \text{스칼라 (1×1)}$$

차원이 맞아떨어지면서 하나의 숫자(스칼라)가 나옴!

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

### Box-Muller와 다변량 정규분포의 연결

```
역변환법 + Box-Muller
       ↓
독립인 표준정규분포 N(0,1) 여러 개 생성
       ↓
행렬 변환 (Cholesky 분해)
       ↓
상관관계 있는 다변량 정규분포
```

**다변량 정규분포 $\mathbf{X} \sim N(\boldsymbol{\mu}, \boldsymbol{\Sigma})$ 생성법:**
1. Box-Muller로 **독립인 표준정규** $Z_1, Z_2, ..., Z_n$ 생성
2. $\boldsymbol{\Sigma} = \mathbf{L}\mathbf{L}^T$ (Cholesky 분해)
3. $\mathbf{X} = \boldsymbol{\mu} + \mathbf{L}\mathbf{Z}$

> Box-Muller는 **독립 정규분포의 "씨앗"**을 만들고, 이를 조합해서 다변량 정규분포를 만든다!

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
