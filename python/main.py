from panda_session import PandaSession
from settings import PASSWORD, USER_NAME


def main():
    session = PandaSession(USER_NAME, PASSWORD)
    session.login()

    class_data = session.query_classes()

    task_data = []
    for d in class_data:
        asm = session.get_assignments(d)
        tq = session.get_testquiz(d)
        task_data.extend(asm)
        task_data.extend(tq)


if __name__ == "__main__":
    main()
