# 공통 교육 DB 실습 문제 풀기

# 문제 1: 테이블 생성하기 (CREATE TABLE)
### 1-1. attendance 테이블은 중복된 데이터가 쌓이는 구조이다. 중복된 데이터는 어떤 컬럼인가?
현재 attendance 테이블 구조에서는 nickname 컬럼이 중복되고 있다.

### 1-2. attendance 테이블에서 중복을 제거하기 위해 crew 테이블을 만들려고 한다. 어떻게 구성해 볼 수 있을까?
- crew_id: 기본키 (Primary Key)
- nickname: 크루의 닉네임

### 1-3. crew 테이블에 들어가야 할 크루들의 정보는 어떻게 추출할까? (hint: DISTINCT)
```sql
SELECT DISTINCT crew_id, nickname
FROM attendance;
```
```
Output:
+---------+-----------+
| crew_id | nickname  |
+---------+-----------+
|       1 | 검프      |
|       2 | 구구      |
|       3 | 네오      |
|       4 | 브라운    |
|       5 | 브리      |
|       6 | 포비      |
|       7 | 워니      |
|       8 | 리사      |
|       9 | 제임스    |
|      10 | 류시      |
|      11 | 디노      |
|      12 | 시지프    |
+---------+-----------+
```

### 1-4. 최종적으로 crew 테이블 생성:
```sql
CREATE TABLE crew (
    crew_id INT NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    PRIMARY KEY (crew_id)
);
```

### 1-5. attendance 테이블에서 크루 정보를 추출해서 crew 테이블에 삽입하기:
```sql
INSERT INTO crew (crew_id, nickname)
SELECT DISTINCT crew_id, nickname
FROM attendance;
```

# 문제 2: 테이블 컬럼 삭제하기 (ALTER TABLE)
### 2-1. crew 테이블을 만들고 중복을 제거했다. attendance에서 불필요해지는 컬럼은?
nickname

### 2-2. 컬럼을 삭제하려면 어떻게 해야 하는가?
```sql
ALTER TABLE attendance DROP COLUMN nickname;
```

# 문제 3: 외래키 설정하기
### 3-1. 만약에 crew 테이블에는 crew_id가 12번인 크루가 존재하지 않지만, attendance 테이블에는 여전히 crew_id가 12번인 크루가 존재한다면?
crew 테이블에는 없는 ID가 attendance 테이블에 남아 있다면, 해당 출석 기록은 누구의 기록인지 알 수 없는 유령 데이터가 된다. 
이를 방지하기 위해 attendance 테이블의 crew_id가 crew 테이블의 crew_id를 참조하도록 Foreign Key를 설정해야 한다.
```sql
ALTER TABLE attendance
ADD CONSTRAINT fk_attendance_crew
FOREIGN KEY (crew_id) REFERENCES crew(crew_id);
```
외래키 설정 시 얻게 되는 효과
- 입력 제한: crew 테이블에 등록되지 않은 crew_id를 가진 데이터는 attendance 테이블에 INSERT하거나 UPDATE할 수 없게 된다.
- 삭제 제한: attendance 테이블에 출석 기록이 남아 있는 크루는 crew 테이블에서 함부로 삭제할 수 없다. (실수로 인한 데이터 손실 방지)
- 데이터 일관성: 출석 데이터는 반드시 등록된 크루이다.

# 문제 4: 유니크 키 설정
### 4-1. 우아한테크코스에서는 닉네임의 '중복'이 엄연히 금지된다. 그런데 현재 테이블에는 중복된 닉네임이 담길 수 있다. crew 테이블의 결함을 어떻게 해결할 수 있을까?
```sql
ALTER TABLE crew
ADD CONSTRAINT uk_nickname UNIQUE (nickname);
```

# 문제 5: 크루 닉네임 검색하기 (LIKE)
### 5-1. 3월 4일, 아침에 검프에게 어떤 크루가 상냥하게 인사했다. 그런데 검프도 구면인 것 같아서 닉네임 첫 글자가 디라는 건 떠올랐는데... 누구지?
디로 시작하는 닉네임을 찾아야 한다.
```sql
SELECT *
FROM crew
WHERE nickname LIKE '디%';
```
```
Output:
+---------+----------+
| crew_id | nickname |
+---------+----------+
|      11 | 디노     |
+---------+----------+
```


# 문제 6: 출석 기록 확인하기 (SELECT + WHERE)
```sql
SELECT a.*
FROM attendance a
JOIN crew c ON a.crew_id = c.crew_id
WHERE c.nickname = '어셔'
  AND a.attendance_date = '2025-03-06';
```
```
Output:
Program did not output anything!
```
결과가 0건인 경우 데이터가 누락된 것이 확인된다.

# 문제 7: 누락된 출석 기록 추가 (INSERT)
```sql
INSERT INTO crew (crew_id, nickname)
VALUES (13, '어셔');

INSERT INTO attendance (crew_id, nickname, attendance_date, start_time, end_time)
VALUES (13, '어셔', '2025-03-06', '09:31:00', '18:01:00');
```

# 문제 8: 잘못된 출석 기록 수정 (UPDATE)

```sql
INSERT INTO crew (crew_id, nickname)
VALUES (14, '주니');

INSERT INTO attendance (crew_id, nickname, attendance_date, start_time, end_time)
VALUES (14, '주니', '2025-03-12', '10:05:00', '18:01:00');

UPDATE attendance
SET start_time = '10:00:00'
WHERE crew_id = (SELECT crew_id FROM crew WHERE nickname = '주니')
  AND attendance_date = '2025-03-12';
```
```
Output:
+---------------+---------+----------+-----------------+------------+----------+
| attendance_id | crew_id | nickname | attendance_date | start_time | end_time |
+---------------+---------+----------+-----------------+------------+----------+
|            76 |      14 | 주니     | 2025-03-12      | 10:00:00   | 18:01:00 |
+---------------+---------+----------+-----------------+------------+----------+
```
수정 완료!

# 문제 9: 허위 출석 기록 삭제 (DELETE)
```sql
INSERT INTO crew (crew_id, nickname)
VALUES (15, '아론');

INSERT INTO attendance (crew_id, nickname, attendance_date, start_time, end_time)
VALUES (15, '아론', '2025-03-12', '10:00:00', '18:01:00');

DELETE FROM attendance
WHERE crew_id = (SELECT crew_id FROM crew WHERE nickname = '아론')
  AND attendance_date = '2025-03-12';
```
```
Output:
Program did not output anything!
```

# 문제 10: 출석 정보 조회하기 (JOIN)
```sql
SELECT
    c.nickname,
    a.attendance_date,
    a.start_time,
    a.end_time
FROM attendance AS a
JOIN crew AS c ON a.crew_id = c.crew_id;
```

# 문제 11: nickname으로 쿼리 처리하기 (서브 쿼리)
```sql
SELECT *
FROM attendance
WHERE crew_id = (SELECT crew_id FROM crew WHERE nickname = '검프');
```

# 문제 12: 가장 늦게 하교한 크루 찾기
```sql
SELECT
    c.nickname,
    a.end_time
FROM attendance a
JOIN crew c ON a.crew_id = c.crew_id
WHERE a.attendance_date = '2025-03-05'
ORDER BY a.end_time DESC
LIMIT 1;
```
```
Output:
+----------+----------+
| nickname | end_time |
+----------+----------+
| 네오     | 18:15:00 |
+----------+----------+
```

# 문제 13: 크루별로 '기록된' 날짜 수 조회
```sql
SELECT
    c.nickname,
    COUNT(a.attendance_id) AS attendance_count
FROM crew c
LEFT JOIN attendance a ON c.crew_id = a.crew_id
GROUP BY c.crew_id, c.nickname;
```
```
Output:
+-----------+------------------+
| nickname  | attendance_count |
+-----------+------------------+
| 검프      |                7 |
| 구구      |                6 |
| 네오      |                5 |
| 브라운    |                7 |
| 브리      |                6 |
| 포비      |                5 |
| 워니      |                4 |
| 리사      |                7 |
| 제임스    |                7 |
| 류시      |                7 |
| 디노      |                7 |
| 시지프    |                7 |
| 아론      |                0 |
+-----------+------------------+
```

# 문제 14: 크루별로 등교 기록이 있는(start_time IS NOT NULL) 날짜 수 조회
```sql
SELECT
    c.nickname,
    COUNT(a.start_time) AS present_days
FROM crew c
JOIN attendance a ON c.crew_id = a.crew_id
WHERE a.start_time IS NOT NULL
GROUP BY c.crew_id, c.nickname;
```
```
Output:
+-----------+--------------+
| nickname  | present_days |
+-----------+--------------+
| 검프      |            7 |
| 구구      |            6 |
| 네오      |            5 |
| 브라운    |            7 |
| 브리      |            6 |
| 포비      |            5 |
| 워니      |            4 |
| 리사      |            7 |
| 제임스    |            7 |
| 류시      |            7 |
| 디노      |            7 |
| 시지프    |            7 |
+-----------+--------------+
```

# 문제 15: 날짜별로 등교한 크루 수 조회
```sql
SELECT
    attendance_date,
    COUNT(start_time) AS daily_crew_count
FROM attendance
WHERE start_time IS NOT NULL
GROUP BY attendance_date
ORDER BY attendance_date ASC;
```
```
Output:
+-----------------+------------------+
| attendance_date | daily_crew_count |
+-----------------+------------------+
| 2025-03-04      |               12 |
| 2025-03-05      |               12 |
| 2025-03-06      |                9 |
| 2025-03-07      |               10 |
| 2025-03-10      |               10 |
| 2025-03-11      |               10 |
| 2025-03-12      |               12 |
+-----------------+------------------+
```

# 문제 16: 크루별 가장 빠른 등교 시각(MIN)과 가장 늦은 등교 시각(MAX)
```sql
SELECT 
    c.nickname, 
    MIN(a.start_time) AS earliest_start, 
    MAX(a.start_time) AS latest_start
FROM crew c
JOIN attendance a ON c.crew_id = a.crew_id
WHERE a.start_time IS NOT NULL
GROUP BY c.crew_id, c.nickname;
```
```
Output:
+-----------+----------------+--------------+
| nickname  | earliest_start | latest_start |
+-----------+----------------+--------------+
| 검프      | 09:45:00       | 12:55:00     |
| 구구      | 09:58:00       | 10:10:00     |
| 네오      | 09:55:00       | 13:05:00     |
| 브라운    | 09:59:00       | 13:00:00     |
| 브리      | 09:55:00       | 10:20:00     |
| 포비      | 09:52:00       | 13:10:00     |
| 워니      | 09:50:00       | 12:59:00     |
| 리사      | 09:55:00       | 13:02:00     |
| 제임스    | 09:55:00       | 12:59:00     |
| 류시      | 09:45:00       | 13:03:00     |
| 디노      | 09:55:00       | 12:57:00     |
| 시지프    | 09:52:00       | 12:58:00     |
+-----------+----------------+--------------+
```